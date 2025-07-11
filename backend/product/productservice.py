import nltk
import pandas as pd
from fastapi import Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import MinMaxScaler
from sqlalchemy.orm.session import Session

from config.database import get_db
from config.hashing import Hashing
from dto.productschema import ProductSchema
from models.productmodels import ProductModel, ReviewModel

nltk.download("vader_lexicon")
sia = SentimentIntensityAnalyzer()


class ProductService:
    @staticmethod
    def get_all_product(db: Session):
        return db.query(ProductModel).order_by(ProductModel.id.desc()).all()

    @staticmethod
    def recommend_products(db: Session) -> dict:
        """
        Collaborative Filtering with Nearest Neighbors algorithm is used to recommend
        products to users based on two features. i.e. rating and price. First product
        data is retrieved from db using ProductService.get_all_product(db). A data frame
        is made with pandas where each product is a row in the data frame with attributes.
        The product rating are prices are normalized using MixMaxScaler. Nearest
        Neighbors algorithm is used to build the recommendation model and this is used
        to find similar products based on proximity of rating and price attribute vectors.
        NN model is used to find products similar to the first product in the dataset.
        This is done by identifying products that have high cosine similarity to reference
        the product in the rating-price feature space. The recommended products are sorted
        by highest rating (descending) and lowest price (ascending), using the sort
        function on the dataframe. The top products are selected as recommendations.
        The accuracy is compared with the 10 highest rated products from original dataset.
        If a product appears in both lists, it is counted as correct.
        """

        products = ProductService.get_all_product(db)

        df = pd.DataFrame(
            [
                {
                    "id": product.id,
                    "name": product.name,
                    "description": product.description,
                    "image": product.image,
                    "countInStock": product.countInStock,
                    "price": product.price,
                    "rating": float(product.rating),
                }
                for product in products
            ]
        )

        nn_model = NearestNeighbors(
            n_neighbors=5, metric="cosine", algorithm="brute", n_jobs=-1
        )
        nn_model.fit(df[["rating", "price"]])

        similar_indices = nn_model.kneighbors(
            df[["rating", "price"]].iloc[[0]], n_neighbors=10, return_distance=False
        )

        recommended_products = []
        for similar_index in similar_indices:
            similar_products = df.iloc[similar_index[1:]]
            recommended_products.extend(similar_products.to_dict(orient="records"))

        recommended_products.sort(key=lambda x: (-x["rating"], x["price"]))

        top_recommended_products = recommended_products[:10]

        recommended_product_info = [
            {
                "id": product["id"],
                "name": product["name"],
                "description": product["description"],
                "image": product["image"],
                "countInStock": product["countInStock"],
                "price": product["price"],
                "rating": product["rating"],
            }
            for product in top_recommended_products
        ]

        accuracy = 0.0
        if top_recommended_products:
            actual_top_rated_products = df.nlargest(10, "rating")
            matching_products = [
                product
                for product in top_recommended_products
                if product["id"] in actual_top_rated_products["id"].tolist()
            ]
            accuracy = len(matching_products) / 10.0

        result = {
            "recommended_products": recommended_product_info,
            "accuracy": accuracy,
        }

        return result

    @staticmethod
    def create_product(request: ProductSchema, db: Session):
        new_product = ProductModel(
            name=request.name,
            image=request.image,
            category=request.category,
            description=request.description,
            price=request.price,
            countInStock=request.countInStock,
            rating=request.rating,
        )

        db.add(new_product)
        db.commit()
        db.refresh(new_product)

        return new_product

    @staticmethod
    def show_product(productid: int, db: Session) -> dict:
        show_p = db.query(ProductModel).filter(ProductModel.id == productid).first()
        review_id = (
            db.query(ReviewModel).filter(ReviewModel.product_id == show_p.id).all()
        )

        reviews_with_sentiment = []
        for review in review_id:
            sentiment_scores = sia.polarity_scores(review.comment)
            sentiment_score = sentiment_scores["compound"]

            if sentiment_score >= 0.05:
                sentiment_label = "POSITIVE"
            elif sentiment_score <= -0.05:
                sentiment_label = "NEGATIVE"
            else:
                sentiment_label = "NEUTRAL"

            review_info = {
                "id": review.id,
                "rating": review.rating,
                "comment": review.comment,
                "sentiment": sentiment_label,
                "sentiment_score": sentiment_score,
            }
            reviews_with_sentiment.append(review_info)

        response = {
            "id": show_p.id,
            "category": show_p.category,
            "price": show_p.price,
            "rating": show_p.rating,
            "image": show_p.image,
            "name": show_p.name,
            "description": show_p.description,
            "countInStock": show_p.countInStock,
            "reviews": reviews_with_sentiment,
        }

        return response

    @staticmethod
    def update_product(productid: int, request: ProductSchema, db: Session):
        product_id = db.query(ProductModel).filter(ProductModel.id == productid).first()

        product_id.name = request.name
        product_id.image = request.image
        product_id.category = request.category
        product_id.description = request.description
        product_id.price = request.price
        product_id.countInStock = request.countInStock
        product_id.rating = request.rating
        db.commit()

        return product_id

    @staticmethod
    def delete_product(productid: int, db: Session):
        del_product = (
            db.query(ProductModel).filter(ProductModel.id == productid).first()
        )

        db.delete(del_product)
        db.commit()

        return "Done"
