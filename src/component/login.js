import axios from "axios";
import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";

const LoginComponent = (props) => {

    const [user, setUser] = useState({
        user_name: '',
        password: ''
    });

    const loginAPI = "http://localhost:4000/login";
    const headers = {
        'Content-Type': 'application/json',
    }

    const setValue = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setUser({
            ...user,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        console.log("created page");
        e.preventDefault();

        const params = {
            user_name: user.user_name,
            password: user.password
        }

        axios.post(loginAPI, params, { headers }).then(res => {
            if (res && res.status === 200) {
                localStorage.setItem('user_id',res.data.data._id)
                props.history.push('/task');
                toast.success("Login successfully...");
            } else {

                toast.success("Something Wrong...");
            }
        }).catch(function (error) {
            if (error.response) {
                const response = error.response.data;
                toast.error(response.message);
                if (response.message === undefined) {
                    toast.error(response.errors[0].msg)
                }

            }
        })
    }

    return (
        <Fragment>
            <div>
                <div className="container">
                    <div className="card-header">
                        <h1>Login</h1>
                    </div>
                    <div className="card-body">
                        <form onSubmit={(e) => handleSubmit(e)}>
                            <input type="user_name" placeholder="User Name" name="user_name" onChange={(e) => setValue(e)} className="form-control form-group" />
                            <input type="password" placeholder="password" name="password" onChange={(e) => setValue(e)} className="form-control form-group" />

                            <button type="submit" className="btn-primery">Submit</button>
                            
                        </form>
                        <a href='/'>Register</a>
                    </div>
                   
                </div>
            </div>
        </Fragment>
    )
}

export default LoginComponent;