import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { callApi } from "./utils.js";

const login_fb = (username, password, navigate) => {
  const data = { email: username, password: password };
  const params = { people_num: 10, message_num: 300 };

  callApi("http://127.0.0.1:8000/login", "POST", { info: data, params: params })
    .then(data => {
      // TODO : nevigate to loading page first, fetch data there, then to home page
      console.log("data", data);
      navigate("/home", {state: {data}});
    });

  // fetch("http://127.0.0.1:8000/login", {
  //   method: "POST",
  //   body: JSON.stringify({ info: data, params: params }),
  //   headers: {
  //     "Content-Type": "application/json"
  //   }
  // })
  // .then(response => {
  //   if (response.ok) {
  //     return response.json()
  //     // console.log("response data", response.json());
  //   } else {
  //     // handle login error
  //     console.log("login error");
  //   }
  // })
  // .then(data => {
  //   console.log("data", data);
  //   navigate("/home", {state: {data}});
  // })
  // .catch(error => {
  //   // handle network error
  //   console.log("network error");
  // });
};


const Login = () => {
  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  // const users = [{ username: "Jane", password: "testpassword" }];
  const handleSubmit = (e) => {
    e.preventDefault();
    // const account = users.find((user) => user.username === username);
    login_fb(username, password, navigate);
    localStorage.setItem("authenticated", JSON.stringify(true));
    console.log("setItem authenticated", localStorage.getItem("authenticated"));
      // navigate("/home");
    
  };
  return (
    <div>
            <p>Welcome Back</p>
            
      <form onSubmit={handleSubmit}>
              
        <input
          type="text"
          name="Username"
          value={username}
          onChange={(e) => setusername(e.target.value)}
        />
              
        <input
          type="password"
          name="Password"
          onChange={(e) => setpassword(e.target.value)}
        />
              
        <input type="submit" value="Submit" />
              
      </form>
          
    </div>
  );
};

export default Login;
