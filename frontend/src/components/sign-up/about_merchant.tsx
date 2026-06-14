import { RegisterData } from "../../app/sign-up/page";
import AuthInputComponent from "../auth/input_column";

export default function InputAboutMerchant({input_value, update_function, errors}: 
  { input_value: RegisterData
    update_function: <K extends keyof RegisterData>(key: K, value: RegisterData[K]) => void
    errors: Partial<Record<keyof RegisterData | "general", string>>
  }) {
    const category_list = 
    [
      {
        value: "bakery",
        label: "Bakery",
      },{
        value: "restaurant",
        label: "Restaurant"
      }, {
        value: "grocery",
        label: "Grocery Store"
      }, {
        value: "Cafe",
        label: "Cafe"
      }, {
        value: "other",
        label: "Other"
      }

    ];

    return (
            <>
              <AuthInputComponent label="Store Name" name="merchant_name" placeholder="e.g. Jane Doe" onChange={update_function} type="text" value={input_value.merchant_name} error={errors.merchant_name}/>

              <AuthInputComponent label="Category" name="category" placeholder="Select a category (e.g., Bakery, Restaurant, Cafe)" onChange={update_function} type="select" value={input_value.category} error={errors.category} selectOptions={category_list}/>

              <AuthInputComponent label="Shot Description" name="desc" placeholder="e.g. Fresh bread and pastries made daily" onChange={update_function} type="textarea" value={input_value.desc} error={errors.desc}/>

            </>


    );
  }