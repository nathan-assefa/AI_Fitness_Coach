// import React, { useState } from "react";
// import { useMutation, useQueryClient } from "react-query";

// type Props = {
//   productId: string;
//   onClose: () => void;
//   currentPrice?: string;
// };

// const UpdateStripeProductPrice: React.FC<Props> = ({
//   productId,
//   onClose,
//   currentPrice,
// }) => {
//   const [newPrice, setNewPrice] = useState<number | string>(
//     currentPrice ? parseFloat(currentPrice) : ""
//   );

//   const queryClient = useQueryClient();

//   const mutation = useMutation(
//     async ({
//       productId,
//       newPrice,
//     }: {
//       productId: string;
//       newPrice: string;
//     }) => {
//       const response = await fetch(
//         `${import.meta.env.VITE_SERVER_URL}/stripe-product-price-update/`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             product_id: productId,
//             new_price: newPrice,
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update product price");
//       }

//       return response.json();
//     },
//     {
//       onSuccess: async () => {
//         await queryClient.invalidateQueries("stripeProducts");
//         onClose();
//       },
//     }
//   );

//   const handleSaveChanges = () => {
//     if (newPrice) {
//       mutation.mutate({ productId, newPrice: newPrice.toString() });
//     }
//   };

//   return (
//     <div>
//       <div className="modal position-relative d-block" role="dialog">
//         <div className="modal-dialog" role="document">
//           <div className="modal-content">
//             <div className="modal-body">
//               <p>Insert new product price here.</p>
//               <input
//                 type="number"
//                 className="form-control"
//                 placeholder="Enter amount"
//                 value={newPrice}
//                 onChange={(e) => {
//                   const value = parseFloat(e.target.value);
//                   if (!isNaN(value) && value >= 0) {
//                     setNewPrice(value.toString());
//                   }
//                 }}
//               />
//             </div>
//             <div className="modal-footer d-flex justify-content-end">
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 data-dismiss="modal"
//                 onClick={onClose}
//               >
//                 Close
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-primary"
//                 onClick={handleSaveChanges}
//                 disabled={mutation.isLoading}
//               >
//                 {mutation.isLoading ? "Saving..." : "Save changes"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateStripeProductPrice;

import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import Toast from "react-bootstrap/Toast";
import { toast } from "sonner";

type Props = {
  productId: string;
  onClose: () => void;
  currentPrice?: string;
};

const UpdateStripeProductPrice: React.FC<Props> = ({
  productId,
  onClose,
  currentPrice,
}) => {
  const [newPrice, setNewPrice] = useState<number | string>(
    currentPrice ? parseFloat(currentPrice) : ""
  );
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastVariant, setToastVariant] = useState<string>("");

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async ({
      productId,
      newPrice,
    }: {
      productId: string;
      newPrice: string;
    }) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/stripe-product-price-update/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: productId,
            new_price: newPrice,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product price");
      }

      return response.json();
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("stripeProducts");
        onClose();
        toast.success("you have successfully updated the price");
      },
      onError: (error: Error) => {
        toast.error("error updating the price. Please try latter");
      },
    }
  );

  const handleSaveChanges = () => {
    if (newPrice) {
      mutation.mutate({ productId, newPrice: newPrice.toString() });
    }
  };

  return (
    <div>
      <div className="modal position-relative d-block" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <p>Insert new product price here.</p>
              <input
                type="number"
                className="form-control"
                placeholder="Enter amount"
                value={newPrice}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 0) {
                    setNewPrice(value.toString());
                  }
                }}
              />
            </div>
            <div className="modal-footer d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveChanges}
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        className={`bg-${toastVariant} text-white`}
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
};

export default UpdateStripeProductPrice;
