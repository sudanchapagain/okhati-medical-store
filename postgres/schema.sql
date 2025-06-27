CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.profile (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    email text UNIQUE,
    phone_number text,
    role text DEFAULT 'user',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.addresses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.profile(id) ON DELETE CASCADE,
    type text NOT NULL,
    address_line_1 text NOT NULL,
    address_line_2 text,
    city text NOT NULL,
    state text NOT NULL,
    postal_code text NOT NULL,
    is_default boolean DEFAULT FALSE,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text UNIQUE NOT NULL,
    description text,
    parent_category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    sku text UNIQUE NOT NULL,
    description text,
    price decimal(10, 2) NOT NULL,
    image_url text,
    category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    stock_quantity integer NOT NULL DEFAULT 0,
    is_prescription_required boolean DEFAULT FALSE,
    brand text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.profile(id) ON DELETE SET NULL,
    total_amount decimal(10, 2) NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    shipping_address jsonb,
    billing_address jsonb,
    payment_method text,
    payment_transaction_id text,
    tracking_number text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.order_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
    quantity integer NOT NULL,
    unit_price decimal(10, 2) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.carts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid UNIQUE REFERENCES public.profile(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.cart_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id uuid REFERENCES public.carts(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    quantity integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.reviews (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.profile(id) ON DELETE SET NULL,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.prescriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
    user_id uuid REFERENCES public.profile(id) ON DELETE SET NULL,
    prescription_image_url text NOT NULL,
    is_verified boolean DEFAULT FALSE,
    verified_by uuid REFERENCES public.profile(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile." ON public.profile FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profile FOR UPDATE USING (auth.uid() = id);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own addresses." ON public.addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own addresses." ON public.addresses FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories." ON public.categories FOR SELECT USING (true);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view products." ON public.products FOR SELECT USING (true);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders." ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders." ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own order items." ON public.order_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Users can create order items." ON public.order_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own cart." ON public.carts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own cart." ON public.carts FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own cart items." ON public.cart_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()));
CREATE POLICY "Users can manage their own cart items." ON public.cart_items FOR ALL USING (EXISTS (SELECT 1 FROM public.carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()));

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews." ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create their own reviews." ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews." ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews." ON public.reviews FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own prescriptions." ON public.prescriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upload prescriptions." ON public.prescriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
