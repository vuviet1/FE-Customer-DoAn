/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { Fragment } from "react";
import { Link } from "react-router-dom";

function Slider() {
    return (
        <Fragment>
            <section className="section-slide">
                <div className="wrap-slick1 rs2-slick1">
                    <div className="slick1">
                        <div
                            className="item-slick1 bg-overlay1"
                            style={{
                                backgroundImage: "url(assets/customer/images/slide-05.jpg)",
                            }}
                            data-thumb="assets/customer/images/thumb-01.jpg"
                            data-caption=""
                        >
                            <div className="container h-full">
                                <div className="flex-col-c-m h-full p-t-100 p-b-60 respon5">
                                    <div
                                        className="layer-slick1 animated visible-false"
                                        data-appear="fadeInDown"
                                        data-delay={0}
                                    >
                                        {/* <span className="ltext-202 txt-center cl0 respon2">
                                            Women Collection
                                        </span> */}
                                    </div>
                                    <div
                                        className="layer-slick1 animated visible-false"
                                        data-appear="fadeInUp"
                                        data-delay={800}
                                    >
                                        <h2 className="ltext-104 txt-center cl0 p-t-22 p-b-40 respon1">
                                            Sản phẩm mới
                                        </h2>
                                    </div>
                                    <div
                                        className="layer-slick1 animated visible-false"
                                        data-appear="zoomIn"
                                        data-delay={1600}
                                    >
                                        <Link
                                            to={"/product"}
                                            className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn2 p-lr-15 trans-04"
                                        >
                                            Mua sắm ngay
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="item-slick1 bg-overlay1"
                            style={{
                                backgroundImage: "url(assets/customer/images/slide-06.jpg)",
                            }}
                            data-thumb="assets/customer/images/thumb-02.jpg"
                            data-caption=""
                        >
                            <div className="container h-full">
                                <div className="flex-col-c-m h-full p-t-100 p-b-60 respon5">
                                    <div
                                        className="layer-slick1 animated visible-false"
                                        data-appear="rollIn"
                                        data-delay={0}
                                    >
                                        {/* <span className="ltext-202 txt-center cl0 respon2">
                                            Men New-Season
                                        </span> */}
                                    </div>
                                    <div
                                        className="layer-slick1 animated visible-false"
                                        data-appear="lightSpeedIn"
                                        data-delay={800}
                                    >
                                        <h2 className="ltext-104 txt-center cl0 p-t-22 p-b-40 respon1">
                                            Sản phẩm mới
                                        </h2>
                                    </div>
                                    <div
                                        className="layer-slick1 animated visible-false"
                                        data-appear="slideInUp"
                                        data-delay={1600}
                                    >
                                        <Link
                                            to={"/product"}
                                            className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn2 p-lr-15 trans-04"
                                        >
                                            Mua sắm ngay
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="item-slick1 bg-overlay1"
                            style={{
                                backgroundImage: "url(assets/customer/images/slide-07.jpg)",
                            }}
                            data-thumb="assets/customer/images/thumb-03.jpg"
                            data-caption=""
                        >
                            <div className="container h-full">
                                <div className="flex-col-c-m h-full p-t-100 p-b-60 respon5">
                                    <div
                                        className="layer-slick1 animated visible-false"
                                        data-appear="rotateInDownLeft"
                                        data-delay={0}
                                    >
                                        {/* <span className="ltext-202 txt-center cl0 respon2">
                                            Men Collection
                                        </span> */}
                                    </div>
                                    <div
                                        className="layer-slick1 animated visible-false"
                                        data-appear="rotateInUpRight"
                                        data-delay={800}
                                    >
                                        <h2 className="ltext-104 txt-center cl0 p-t-22 p-b-40 respon1">
                                            Sản phẩm mới
                                        </h2>
                                    </div>
                                    <div
                                        className="layer-slick1 animated visible-false"
                                        data-appear="rotateIn"
                                        data-delay={1600}
                                    >
                                        <Link
                                            to={"/product"}
                                            className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn2 p-lr-15 trans-04"
                                        >
                                            Mua sắm ngay
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="wrap-slick1-dots p-lr-10" />
                </div>
            </section>
        </Fragment>
    );
}
export default Slider;
