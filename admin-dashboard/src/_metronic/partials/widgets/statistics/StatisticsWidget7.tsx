import React, { useEffect, useState } from "react";
import { toAbsoluteUrl } from "../../../helpers";
import { Button } from "react-bootstrap";
import UpdateStripeProductPrice from "../../../../app/pages/dashboard/components/update-product-price";

type Props = {
  className: string;
  image: string;
  title: string;
  time: string;
  description: string;
  productId: string;
  currentPrice?: string;
};

const StatisticsWidget7: React.FC<Props> = ({
  className,
  image,
  title,
  time,
  description,
  productId,
  currentPrice,
}) => {
  const [showUpdateStripProduct, setShowUpdateStripProduct] =
    useState<boolean>(false);

  console.log(showUpdateStripProduct);

  const toggleUpdateStripProduct = () => {
    setShowUpdateStripProduct((prev) => !prev);
  };

  useEffect(() => {
    if (showUpdateStripProduct) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }, [showUpdateStripProduct]);

  return (
    <div
      className={`card bgi-no-repeat ${className}`}
      style={{
        backgroundPosition: "right top",
        backgroundSize: "30% auto",
        backgroundImage: `url(${toAbsoluteUrl("media/svg/shapes/" + image)})`,
      }}
    >
      {/* begin::Body */}
      <div className="card-body">
        <a
          href="#"
          className="card-title fw-bold text-muted text-hover-primary fs-4"
        >
          {title}
        </a>

        <div className="fw-bold text-primary my-6">{time}</div>

        <p
          className="text-gray-900-75 fw-semibold fs-5 m-0"
          dangerouslySetInnerHTML={{ __html: description }}
        ></p>
        <Button variant="light" onClick={toggleUpdateStripProduct}>
          Update price
        </Button>
        {showUpdateStripProduct ? (
          <UpdateStripeProductPrice
            onClose={toggleUpdateStripProduct}
            productId={productId}
            currentPrice={currentPrice}
          />
        ) : null}
      </div>
      {/* end::Body */}
    </div>
  );
};

export { StatisticsWidget7 };
