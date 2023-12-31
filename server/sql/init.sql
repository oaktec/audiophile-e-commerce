CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email text NOT NULL,
  password text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL
);

ALTER TABLE users ADD UNIQUE (email);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name text NOT NULL,
  description text,
  price decimal NOT NULL,
  slug text NOT NULL,
  category_id integer NOT NULL REFERENCES categories(id),
  new boolean NOT NULL DEFAULT TRUE,
  features text NOT NULL
);

CREATE TABLE similar_products (
  product_id integer NOT NULL REFERENCES products(id),
  similar_product_id integer NOT NULL REFERENCES products(id)
);

CREATE TABLE product_box_contents (
  product_id integer NOT NULL REFERENCES products(id),
  item text NOT NULL,
  quantity integer NOT NULL
);

CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id),
  active boolean NOT NULL DEFAULT TRUE
);

CREATE TABLE cart_items (
  cart_id integer NOT NULL REFERENCES carts(id),
  product_id integer NOT NULL REFERENCES products(id),
  quantity integer NOT NULL
);

ALTER TABLE cart_items ADD PRIMARY KEY (cart_id, product_id);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id),
  cart_id integer NOT NULL REFERENCES carts(id),
  order_date timestamp NOT NULL DEFAULT NOW(),
  phone text,
  address text NOT NULL,
  city text NOT NULL,
  postcode text NOT NULL,
  payment_method text NOT NULL,
  status text
);