import { RegisterData } from "../../app/sign-up/page";
import AuthInputComponent from "../auth/input_column";

type UserMainData = {
    input_value: RegisterData
    update_function: <K extends keyof RegisterData>(key: K, value: RegisterData[K]) => void
    errors: Partial<Record<keyof RegisterData | "general", string>>
};

export default function InputUserData({input_value, update_function, errors}: UserMainData) {

    errors.full_name
    return (
            <>

              <AuthInputComponent label="Full Name" name="full_name" placeholder="e.g. Jane Doe" onChange={update_function} type="text" value={input_value.full_name} error={errors.full_name}/>
              
              <AuthInputComponent label="Email" name="email" placeholder={`jane_doe@gmail.com`} onChange={update_function} type="email" value={input_value.email} error={errors.email}/>

              <AuthInputComponent label="Password" name="password" placeholder="Create a strong password" onChange={update_function} type="password" value={input_value.password} error={errors.password} />

              <AuthInputComponent label="Confirm Password" name="confirm_password" placeholder="Repeat your password" onChange={update_function} type="password" value={input_value.confirm_password} error={errors.confirm_password}/>

  </>
       

    );
  }