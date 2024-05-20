/* eslint-disable jsx-a11y/anchor-is-valid */
import { Fragment } from "react";
import Header from "./components/header";
import Footer from "./components/footer";

function Home() {
    return (
        <Fragment>
            <Header/>
            {/* Start feature Area */}
            <section className="feature-area section_gap_bottom_custom">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6">
                            <div className="single-feature">
                                <a href="#" className="title">
                                    <i className="flaticon-money" />
                                    <h3>Money back gurantee</h3>
                                </a>
                                <p>Shall open divide a one</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-feature">
                                <a href="#" className="title">
                                    <i className="flaticon-truck" />
                                    <h3>Free Delivery</h3>
                                </a>
                                <p>Shall open divide a one</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-feature">
                                <a href="#" className="title">
                                    <i className="flaticon-support" />
                                    <h3>Alway support</h3>
                                </a>
                                <p>Shall open divide a one</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-feature">
                                <a href="#" className="title">
                                    <i className="flaticon-blockchain" />
                                    <h3>Secure payment</h3>
                                </a>
                                <p>Shall open divide a one</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* End feature Area */}
            {/*================ Feature Product Area =================*/}
            <section className="feature_product_area section_gap_bottom_custom">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-12">
                            <div className="main_title">
                                <h2>
                                    <span>Featured product</span>
                                </h2>
                                <p>
                                    Bring called seed first of third give itself
                                    now ment
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 col-md-6">
                            <div className="single-product">
                                <div className="product-img">
                                    <img
                                        className="img-fluid w-100"
                                        src="assets/images/product/feature-product/f-p-1.jpg"
                                        alt=""
                                    />
                                    <div className="p_icon">
                                        <a href="{{route('customer.single-product')}}">
                                            <i className="ti-eye" />
                                        </a>
                                        <a href="#">
                                            <i className="ti-heart" />
                                        </a>
                                        <a href="{{route('customer.cart')}}">
                                            <i className="ti-shopping-cart" />
                                        </a>
                                    </div>
                                </div>
                                <div className="product-btm">
                                    <a href="#" className="d-block">
                                        <h4>Latest men’s sneaker</h4>
                                    </a>
                                    <div className="mt-3">
                                        <span className="mr-4">$25.00</span>
                                        <del>$35.00</del>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="single-product">
                                <div className="product-img">
                                    <img
                                        className="img-fluid w-100"
                                        src="assets/images/product/feature-product/f-p-2.jpg"
                                        alt=""
                                    />
                                    <div className="p_icon">
                                        <a href="{{route('customer.single-product')}}">
                                            <i className="ti-eye" />
                                        </a>
                                        <a href="#">
                                            <i className="ti-heart" />
                                        </a>
                                        <a href="#">
                                            <i className="ti-shopping-cart" />
                                        </a>
                                    </div>
                                </div>
                                <div className="product-btm">
                                    <a href="#" className="d-block">
                                        <h4>Red women purses</h4>
                                    </a>
                                    <div className="mt-3">
                                        <span className="mr-4">$25.00</span>
                                        <del>$35.00</del>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="single-product">
                                <div className="product-img">
                                    <img
                                        className="img-fluid w-100"
                                        src="assets/images/product/feature-product/f-p-3.jpg"
                                        alt=""
                                    />
                                    <div className="p_icon">
                                        <a href="{{route('customer.single-product')}}">
                                            <i className="ti-eye" />
                                        </a>
                                        <a href="#">
                                            <i className="ti-heart" />
                                        </a>
                                        <a href="{{route('customer.cart')}}">
                                            <i className="ti-shopping-cart" />
                                        </a>
                                    </div>
                                </div>
                                <div className="product-btm">
                                    <a href="#" className="d-block">
                                        <h4>Men stylist Smart Watch</h4>
                                    </a>
                                    <div className="mt-3">
                                        <span className="mr-4">$25.00</span>
                                        <del>$35.00</del>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*================ End Feature Product Area =================*/}
            {/*================ New Product Area =================*/}
            <section className="new_product_area section_gap_top section_gap_bottom_custom">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-12">
                            <div className="main_title">
                                <h2>
                                    <span>new products</span>
                                </h2>
                                <p>
                                    Bring called seed first of third give itself
                                    now ment
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="new_product">
                                <h5 className="text-uppercase">
                                    collection of 2019
                                </h5>
                                <h3 className="text-uppercase">
                                    Men’s summer t-shirt
                                </h3>
                                <div className="product-img">
                                    <img
                                        className="img-fluid"
                                        src="assets/images/product/new-product/new-product1.png"
                                        alt=""
                                    />
                                </div>
                                <h4>$120.70</h4>
                                <a
                                    href="{{route('customer.cart')}}"
                                    className="main_btn"
                                >
                                    Add to cart
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-6 mt-5 mt-lg-0">
                            <div className="row">
                                <div className="col-lg-6 col-md-6">
                                    <div className="single-product">
                                        <div className="product-img">
                                            <img
                                                className="img-fluid w-100"
                                                src="assets/images/product/new-product/n1.jpg"
                                                alt=""
                                            />
                                            <div className="p_icon">
                                                <a href="{{route('customer.single-product')}}">
                                                    <i className="ti-eye" />
                                                </a>
                                                <a href="#">
                                                    <i className="ti-heart" />
                                                </a>
                                                <a href="{{route('customer.cart')}}">
                                                    <i className="ti-shopping-cart" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="product-btm">
                                            <a href="#" className="d-block">
                                                <h4>Nike latest sneaker</h4>
                                            </a>
                                            <div className="mt-3">
                                                <span className="mr-4">
                                                    $25.00
                                                </span>
                                                <del>$35.00</del>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <div className="single-product">
                                        <div className="product-img">
                                            <img
                                                className="img-fluid w-100"
                                                src="assets/images/product/new-product/n2.jpg"
                                                alt=""
                                            />
                                            <div className="p_icon">
                                                <a href="{{route('customer.single-product')}}">
                                                    <i className="ti-eye" />
                                                </a>
                                                <a href="#">
                                                    <i className="ti-heart" />
                                                </a>
                                                <a href="{{route('customer.cart')}}">
                                                    <i className="ti-shopping-cart" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="product-btm">
                                            <a href="#" className="d-block">
                                                <h4>Men’s denim jeans</h4>
                                            </a>
                                            <div className="mt-3">
                                                <span className="mr-4">
                                                    $25.00
                                                </span>
                                                <del>$35.00</del>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <div className="single-product">
                                        <div className="product-img">
                                            <img
                                                className="img-fluid w-100"
                                                src="assets/images/product/new-product/n3.jpg"
                                                alt=""
                                            />
                                            <div className="p_icon">
                                                <a href="{{route('customer.single-product')}}">
                                                    <i className="ti-eye" />
                                                </a>
                                                <a href="#">
                                                    <i className="ti-heart" />
                                                </a>
                                                <a href="{{route('customer.cart')}}">
                                                    <i className="ti-shopping-cart" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="product-btm">
                                            <a href="#" className="d-block">
                                                <h4>quartz hand watch</h4>
                                            </a>
                                            <div className="mt-3">
                                                <span className="mr-4">
                                                    $25.00
                                                </span>
                                                <del>$35.00</del>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <div className="single-product">
                                        <div className="product-img">
                                            <img
                                                className="img-fluid w-100"
                                                src="assets/images/product/new-product/n4.jpg"
                                                alt=""
                                            />
                                            <div className="p_icon">
                                                <a href="{{route('customer.single-product')}}">
                                                    <i className="ti-eye" />
                                                </a>
                                                <a href="#">
                                                    <i className="ti-heart" />
                                                </a>
                                                <a href="{{route('customer.cart')}}">
                                                    <i className="ti-shopping-cart" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="product-btm">
                                            <a href="#" className="d-block">
                                                <h4>adidas sport shoe</h4>
                                            </a>
                                            <div className="mt-3">
                                                <span className="mr-4">
                                                    $25.00
                                                </span>
                                                <del>$35.00</del>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*================ End New Product Area =================*/}
            {/*================ Inspired Product Area =================*/}
            <section className="inspired_product_area section_gap_bottom_custom">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-12">
                            <div className="main_title">
                                <h2>
                                    <span>Inspired products</span>
                                </h2>
                                <p>
                                    Bring called seed first of third give itself
                                    now ment
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-6">
                            <div className="single-product">
                                <div className="product-img">
                                    <img
                                        className="img-fluid w-100"
                                        src="assets/images/product/inspired-product/i1.jpg"
                                        alt=""
                                    />
                                    <div className="p_icon">
                                        <a href="{{route('customer.single-product')}}">
                                            <i className="ti-eye" />
                                        </a>
                                        <a href="#">
                                            <i className="ti-heart" />
                                        </a>
                                        <a href="{{route('customer.cart')}}">
                                            <i className="ti-shopping-cart" />
                                        </a>
                                    </div>
                                </div>
                                <div className="product-btm">
                                    <a href="#" className="d-block">
                                        <h4>Latest men’s sneaker</h4>
                                    </a>
                                    <div className="mt-3">
                                        <span className="mr-4">$25.00</span>
                                        <del>$35.00</del>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-product">
                                <div className="product-img">
                                    <img
                                        className="img-fluid w-100"
                                        src="assets/images/product/inspired-product/i2.jpg"
                                        alt=""
                                    />
                                    <div className="p_icon">
                                        <a href="{{route('customer.single-product')}}">
                                            <i className="ti-eye" />
                                        </a>
                                        <a href="#">
                                            <i className="ti-heart" />
                                        </a>
                                        <a href="{{route('customer.cart')}}">
                                            <i className="ti-shopping-cart" />
                                        </a>
                                    </div>
                                </div>
                                <div className="product-btm">
                                    <a href="#" className="d-block">
                                        <h4>Latest men’s sneaker</h4>
                                    </a>
                                    <div className="mt-3">
                                        <span className="mr-4">$25.00</span>
                                        <del>$35.00</del>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-product">
                                <div className="product-img">
                                    <img
                                        className="img-fluid w-100"
                                        src="assets/images/product/inspired-product/i3.jpg"
                                        alt=""
                                    />
                                    <div className="p_icon">
                                        <a href="{{route('customer.single-product')}}">
                                            <i className="ti-eye" />
                                        </a>
                                        <a href="#">
                                            <i className="ti-heart" />
                                        </a>
                                        <a href="{{route('customer.cart')}}">
                                            <i className="ti-shopping-cart" />
                                        </a>
                                    </div>
                                </div>
                                <div className="product-btm">
                                    <a href="#" className="d-block">
                                        <h4>Latest men’s sneaker</h4>
                                    </a>
                                    <div className="mt-3">
                                        <span className="mr-4">$25.00</span>
                                        <del>$35.00</del>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-product">
                                <div className="product-img">
                                    <img
                                        className="img-fluid w-100"
                                        src="assets/images/product/inspired-product/i4.jpg"
                                        alt=""
                                    />
                                    <div className="p_icon">
                                        <a href="{{route('customer.single-product')}}">
                                            <i className="ti-eye" />
                                        </a>
                                        <a href="#">
                                            <i className="ti-heart" />
                                        </a>
                                        <a href="{{route('customer.cart')}}">
                                            <i className="ti-shopping-cart" />
                                        </a>
                                    </div>
                                </div>
                                <div className="product-btm">
                                    <a href="#" className="d-block">
                                        <h4>Latest men’s sneaker</h4>
                                    </a>
                                    <div className="mt-3">
                                        <span className="mr-4">$25.00</span>
                                        <del>$35.00</del>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-product">
                                <div className="product-img">
                                    <img
                                        className="img-fluid w-100"
                                        src="assets/images/product/inspired-product/i5.jpg"
                                        alt=""
                                    />
                                    <div className="p_icon">
                                        <a href="{{route('customer.single-product')}}">
                                            <i className="ti-eye" />
                                        </a>
                                        <a href="#">
                                            <i className="ti-heart" />
                                        </a>
                                        <a href="{{route('customer.cart')}}">
                                            <i className="ti-shopping-cart" />
                                        </a>
                                    </div>
                                </div>
                                <div className="product-btm">
                                    <a href="#" className="d-block">
                                        <h4>Latest men’s sneaker</h4>
                                    </a>
                                    <div className="mt-3">
                                        <span className="mr-4">$25.00</span>
                                        <del>$35.00</del>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-product">
                                <div className="product-img">
                                    <img
                                        className="img-fluid w-100"
                                        src="assets/images/product/inspired-product/i6.jpg"
                                        alt=""
                                    />
                                    <div className="p_icon">
                                        <a href="{{route('customer.single-product')}}">
                                            <i className="ti-eye" />
                                        </a>
                                        <a href="#">
                                            <i className="ti-heart" />
                                        </a>
                                        <a href="{{route('customer.cart')}}">
                                            <i className="ti-shopping-cart" />
                                        </a>
                                    </div>
                                </div>
                                <div className="product-btm">
                                    <a href="#" className="d-block">
                                        <h4>Latest men’s sneaker</h4>
                                    </a>
                                    <div className="mt-3">
                                        <span className="mr-4">$25.00</span>
                                        <del>$35.00</del>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-product">
                                <div className="product-img">
                                    <img
                                        className="img-fluid w-100"
                                        src="assets/images/product/inspired-product/i7.jpg"
                                        alt=""
                                    />
                                    <div className="p_icon">
                                        <a href="{{route('customer.single-product')}}">
                                            <i className="ti-eye" />
                                        </a>
                                        <a href="#">
                                            <i className="ti-heart" />
                                        </a>
                                        <a href="{{route('customer.cart')}}">
                                            <i className="ti-shopping-cart" />
                                        </a>
                                    </div>
                                </div>
                                <div className="product-btm">
                                    <a href="#" className="d-block">
                                        <h4>Latest men’s sneaker</h4>
                                    </a>
                                    <div className="mt-3">
                                        <span className="mr-4">$25.00</span>
                                        <del>$35.00</del>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-product">
                                <div className="product-img">
                                    <img
                                        className="img-fluid w-100"
                                        src="assets/images/product/inspired-product/i8.jpg"
                                        alt=""
                                    />
                                    <div className="p_icon">
                                        <a href="{{route('customer.single-product')}}">
                                            <i className="ti-eye" />
                                        </a>
                                        <a href="#">
                                            <i className="ti-heart" />
                                        </a>
                                        <a href="{{route('customer.cart')}}">
                                            <i className="ti-shopping-cart" />
                                        </a>
                                    </div>
                                </div>
                                <div className="product-btm">
                                    <a href="#" className="d-block">
                                        <h4>Latest men’s sneaker</h4>
                                    </a>
                                    <div className="mt-3">
                                        <span className="mr-4">$25.00</span>
                                        <del>$35.00</del>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*================ End Inspired Product Area =================*/}
            {/*================ Start Blog Area =================*/}
            <section className="blog-area section-gap">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-12">
                            <div className="main_title">
                                <h2>
                                    <span>latest blog</span>
                                </h2>
                                <p>
                                    Bring called seed first of third give itself
                                    now ment
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 col-md-6">
                            <div className="single-blog">
                                <div className="thumb">
                                    <img
                                        className="img-fluid"
                                        src="assets/images/b1.jpg"
                                        alt=""
                                    />
                                </div>
                                <div className="short_details">
                                    <div className="meta-top d-flex">
                                        <a href="#">By Admin</a>
                                        <a href="#">
                                            <i className="ti-comments-smiley" />
                                            2 Comments
                                        </a>
                                    </div>
                                    <a
                                        className="d-block"
                                        href="{{route('customer.single-blog')}}"
                                    >
                                        <h4>
                                            Ford clever bed stops your sleeping
                                            partner hogging the whole
                                        </h4>
                                    </a>
                                    <div className="text-wrap">
                                        <p>
                                            Let one fifth i bring fly to divided
                                            face for bearing the divide unto
                                            seed winged divided light Forth.
                                        </p>
                                    </div>
                                    <a
                                        href="{{route('customer.single-blog')}}"
                                        className="blog_btn"
                                    >
                                        Learn More{" "}
                                        <span className="ml-2 ti-arrow-right" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="single-blog">
                                <div className="thumb">
                                    <img
                                        className="img-fluid"
                                        src="assets/images/b2.jpg"
                                        alt=""
                                    />
                                </div>
                                <div className="short_details">
                                    <div className="meta-top d-flex">
                                        <a href="#">By Admin</a>
                                        <a href="#">
                                            <i className="ti-comments-smiley" />
                                            2 Comments
                                        </a>
                                    </div>
                                    <a
                                        className="d-block"
                                        href="{{route('customer.single-blog')}}"
                                    >
                                        <h4>
                                            Ford clever bed stops your sleeping
                                            partner hogging the whole
                                        </h4>
                                    </a>
                                    <div className="text-wrap">
                                        <p>
                                            Let one fifth i bring fly to divided
                                            face for bearing the divide unto
                                            seed winged divided light Forth.
                                        </p>
                                    </div>
                                    <a
                                        href="{{route('customer.single-blog')}}"
                                        className="blog_btn"
                                    >
                                        Learn More{" "}
                                        <span className="ml-2 ti-arrow-right" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="single-blog">
                                <div className="thumb">
                                    <img
                                        className="img-fluid"
                                        src="assets/images/b3.jpg"
                                        alt=""
                                    />
                                </div>
                                <div className="short_details">
                                    <div className="meta-top d-flex">
                                        <a href="#">By Admin</a>
                                        <a href="#">
                                            <i className="ti-comments-smiley" />
                                            2 Comments
                                        </a>
                                    </div>
                                    <a
                                        className="d-block"
                                        href="{{route('customer.single-blog')}}"
                                    >
                                        <h4>
                                            Ford clever bed stops your sleeping
                                            partner hogging the whole
                                        </h4>
                                    </a>
                                    <div className="text-wrap">
                                        <p>
                                            Let one fifth i bring fly to divided
                                            face for bearing the divide unto
                                            seed winged divided light Forth.
                                        </p>
                                    </div>
                                    <a
                                        href="{{route('customer.single-blog')}}"
                                        className="blog_btn"
                                    >
                                        Learn More{" "}
                                        <span className="ml-2 ti-arrow-right" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*================ End Blog Area =================*/}
            <Footer/>
        </Fragment>
    );
}

export default Home;
