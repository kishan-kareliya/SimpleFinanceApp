import { InputBox } from "../components/InputBox"
import { Heading } from "../components/Heading"
import { SubHeading } from '../components/SubHeading'
import { Button } from '../components/Button';
import { BottomWarning } from "../components/BottomWarning";
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ToastNotification from "../components/ToastNotification";
import Loader from "../components/Loader";

const SignUp = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const registerUser = async () => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:3000/api/v1/user/signup', {
                username,
                firstName,
                lastName,
                password
            })
            if (response.data.token) {
                setSuccess(true);
                if (localStorage.getItem("token")) {
                    localStorage.removeItem("token");
                }
                localStorage.setItem("token", response.data.token)
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500)
            }
        }
        catch (err) {
            if (err.response && err.response.data) {
                console.log(err.response.data.message);
                setError(err.response.data.message);
            } else {
                setError('An error occurred. Please try again.');
            }
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex relative h-screen justify-center w-full items-center bg-gray-200 ">
            <div className="border bg-white flex flex-col rounded-lg lg:w-1/3 md:w-2/3 w-11/12">
                <div className="text-center">
                    <Heading label={"Sign Up"} />
                    <SubHeading label={"Enter your information to create an account"} />
                </div>
                <div className="flex flex-col gap-2 md:px-12 px-6 md:py-6 py-4 border">

                    <InputBox onChange={(e) => setFirstName(e.target.value)} type={"text"} placeholder={"Jhon"} label={"First Name"} className="w-full border rounded border-slate-200" />

                    <InputBox onChange={(e) => setLastName(e.target.value)} type={"text"} placeholder={"Doe"} label={"Last Name"} className="w-full border rounded border-slate-200" />

                    <InputBox onChange={(e) => setUsername(e.target.value)} type={"email"} placeholder={"kishan@gmail.com"} label={"Email"} className="w-full border rounded border-slate-200" />

                    <InputBox onChange={(e) => setPassword(e.target.value)} type={"password"} placeholder={"123456"} label={"Password"} className="w-full rounded" />

                    <Button onClick={registerUser} disabled={loading} className="w-full mt-4" >
                        {loading ? <Loader /> : "Sign Up"}
                    </Button>

                    <BottomWarning label={"Sign in"} bottomText={"Already have an account?"} to={"/signin"} />
                </div>
            </div>
            <div className="absolute bottom-5 right-5">
                {error ? (<ToastNotification variant={"error"} message={error} />) : ''}
                {success ? (<ToastNotification variant={"success"} message={"Signup Successful! "} />) : ''}
            </div>
        </div>
    )
}

export default SignUp