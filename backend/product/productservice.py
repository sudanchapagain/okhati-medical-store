from fastapi import HTTPException, status
from sqlalchemy.orm.session import Session

from dto.productschema import ProductSchema
from models.productmodels import ProductModel, ReviewModel


class ProductService:
    @staticmethod
    def get_all_product(db: Session):
        return db.query(ProductModel).order_by(ProductModel.id.desc()).all()

    @staticmethod
    def recommend_products(db: Session) -> dict:
        products = (
            db.query(ProductModel)
            .order_by(ProductModel.rating.desc(), ProductModel.price.asc())
            .limit(10)
            .all()
        )

        recommended_product_info = [
            {
                "id": product.id,
                "name": product.name,
                "description": product.description,
                "image": product.image,
                "countInStock": product.countInStock,
                "price": product.price,
                "rating": product.rating,
            }
            for product in products
        ]

        return {
            "recommended_products": recommended_product_info,
            "accuracy": 1.0,
        }

    @staticmethod
    def create_product(request: ProductSchema, db: Session):
        try:
            new_product = ProductModel(
                name=request.name,
                image=request.image or "",
                category=request.category,
                description=request.description or "",
                price=request.price,
                countInStock=request.countInStock,
                rating=request.rating or 0,
            )

            db.add(new_product)
            db.commit()
            db.refresh(new_product)
            return new_product

        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create product",
            )

    @staticmethod
    def show_product(productid: int, db: Session) -> dict:
        product = db.query(ProductModel).filter(ProductModel.id == productid).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
            )

        reviews = (
            db.query(ReviewModel).filter(ReviewModel.product_id == product.id).all()
        )

        review_list = []
        for review in reviews:
            review_info = {
                "id": review.id,
                "rating": review.rating,
                "comment": review.comment,
            }
            review_list.append(review_info)

        response = {
            "id": product.id,
            "category": product.category,
            "price": product.price,
            "rating": product.rating,
            "image": product.image,
            "name": product.name,
            "description": product.description,
            "countInStock": product.countInStock,
            "reviews": review_list,
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
