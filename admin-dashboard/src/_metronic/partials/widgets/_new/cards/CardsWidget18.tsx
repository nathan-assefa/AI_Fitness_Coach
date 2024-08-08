import { FC } from "react";
import { useQuery } from "react-query";
import { StripApiResponse } from "../../../../../lib/types";
import { StatisticsWidget7 } from "../../statistics/StatisticsWidget7";

const fetchStripeProducts = async () => {
  const apiUrl: string = import.meta.env.VITE_SERVER_URL;
  const response = await fetch(`${apiUrl}/stripe-products/`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

const CardsWidget18: FC = () => {
  const { data, isLoading, isError } = useQuery<StripApiResponse>(
    "stripeProducts",
    fetchStripeProducts
  );

  console.log("data: ", data);

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error fetching data</div>;

  const firstThreeProducts = data?.products?.slice(0, 3);

  return (
    <div>
      <div className="card">
        <div className="card-header border-0 py-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1">
              Stripe Payment Management
            </span>

            <span className="text-muted fw-semibold fs-7">
              Easily update and handle your subscription product prices.
            </span>
          </h3>
        </div>

        <div className="row g-5 g-xl-8">
          {firstThreeProducts?.map((product, idx) => (
            <div key={idx} className="col-xl-4">
              <StatisticsWidget7
                className="card-xl-stretch mb-xl-8"
                image="abstract-4.svg"
                title={product.name.toUpperCase()}
                time={`$${product.pricing}/ month`}
                description=""
                productId={product.product_id}
                currentPrice={product.pricing}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardsWidget18;
