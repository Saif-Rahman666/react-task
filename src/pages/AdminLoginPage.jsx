import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MkdSDK from "../utils/MkdSDK";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext";
import { GlobalContext } from "../globalContext";

const AdminLoginPage = () => {
  const schema = yup
    .object({
      email: yup.string().email().required(),
      password: yup.string().required(),
    })
    .required();

  const { dispatch } = React.useContext(AuthContext);
  //Snackbar message

  const { state, dispatch: snackBarDispatch, showToast } = React.useContext(GlobalContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // const test = () => {

  //   const sdk = new MkdSDK();
  //   sdk.check("admin")

  // }

  const onSubmit = async (data) => {
    let sdk = new MkdSDK();
    //TODO

    const role = "admin";
    const { email, password } = data;

    const resData = await sdk.login(email, password, role);
    //   const data1 = res.json()
    console.log(resData);

    if (resData.token !== "") {
      localStorage.setItem("token", resData.token);
      localStorage.setItem("role", resData.role);
      localStorage.setItem("user_id", resData.user_id);

      dispatch({ type: "LOGIN", payload: { userId: resData.user_id, role: resData.role } });
      snackBarDispatch({ type: "SNACKBAR", payload: { message: "logged in successfully" } });

      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-8 ">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={`"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.email?.message ? "border-red-500" : ""
            }`}
          />
          <p className="text-red-500 text-xs italic">{errors.email?.message}</p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            placeholder="******************"
            {...register("password")}
            className={`shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
              errors.password?.message ? "border-red-500" : ""
            }`}
          />
          <p className="text-red-500 text-xs italic">{errors.password?.message}</p>
        </div>
        <div className="flex items-center justify-between">
          <input
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            value="Sign In"
          />
        </div>
      </form>
      {/* <button onClick={test}>test</button> */}
    </div>
  );
};

export default AdminLoginPage;
