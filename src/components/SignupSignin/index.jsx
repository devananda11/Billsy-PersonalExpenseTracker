import React, { useState } from 'react'
import "./styles.css"
import Input from '../Input'
import Button from '../Button'
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider } from "firebase/auth";
import {auth} from "../../firebase"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from "firebase/firestore";
import {db} from "../../firebase"

function SignupSignin() {
    const[name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const[loading,setLoading]=useState(false);
    const [loginForm,setLoginForm]=useState(false)
    const navigate= useNavigate();
    const provider = new GoogleAuthProvider();
    
    function signupWithEmail(){
        setLoading(true)
        console.log("name",name)
        console.log("email",email)
        console.log("password",password);
        console.log("confirmpassword",confirmPassword);
        //autheticate or create new acc
    if (name.length!="" && email!="" && password!="" && confirmPassword!="") 
   { if (password==confirmPassword){
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log("User>>>",user)
    // ...
    toast.success("User Created")
    setLoading(false);
    setName("");
    setPassword("");
    setEmail("");
    setConfirmPassword("");
    createDoc(user)
    navigate("/dashboard");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
    toast.error(errorMessage)
    setLoading(false)
  });
   }else{
    toast.error("Passwords don't match")
    setLoading(false)
   }
    
   }
   else{
    toast.error("All fields are mandatory")
    setLoading(false)
   } 
    }
  
    
    function loginUsingEmail(){
        if (email!="" && password!="") 
    {console.log("email",email)
    console.log("password",password)
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    toast.success("User Logged in!")
    console.log(user);
    navigate("/dashboard");
    // ...
    setLoading(false);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage)
    setLoading(false);
  });}
  else{
    toast.error("All fields are mandatory")
    setLoading(false);
  }
  }
  
  
  async function createDoc(user) {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    console.log("userData.exists()", userData.exists());
    if (!userData.exists()) {
        try {
            await setDoc(userRef, {
                name: user.displayName || name,
                email: user.email,
                photoURL: user.photoURL || "",
                createdAt: new Date()
            });
            toast.success("Doc created");
        } catch (e) {
            console.error("Error creating doc:", e);
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    } else {
        toast.error("Doc already exists");
        setLoading(false);
    }
}

  function googleAuth(){
    setLoading(true)
    try{
        signInWithPopup(auth, provider)
  .then((result) => {
    
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    
    const user = result.user;
    console.log(user)
    createDoc(user)
    toast.success("User Authenticated!")
    navigate("/dashboard");
    setLoading(false)
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    
    const email = error.customData.email;
    
    const credential = GoogleAuthProvider.credentialFromError(error);
    toast.error(errorMessage);
    // ...
    setLoading(false)
  });
    }catch(e){
        toast.error(e.message);
        setLoading(false)
    }
    
  }



  return (
    <>
        {loginForm ? (
            <div className='signup-wrapper'>
                <h2 className='title'>Login on <span style={{ color: "var(--theme)" }}>Billsy</span></h2>
                <form action="">
                    <Input
                        type="email"
                        label={"Email"}
                        state={email}
                        setState={setEmail}
                        placeholder={"johndoe123@gmail.com"}
                    />
                    <Input
                        type="password"
                        label={"Password"}
                        state={password}
                        setState={setPassword}
                        placeholder={"Example123"}
                    />
                    <Button
                        disabled={loading}
                        text={loading ? "Loading..." : "Login Using Email and Password"}
                        onClick={loginUsingEmail}
                    />
                    <p className='p-login'>OR</p>
                    
                    <Button onClick={googleAuth}
                    text={loading ? "Loading..." : "Login using Google"} blue={true} />
                    
                    <p className='p-login'onClick={() => setLoginForm(!loginForm)} style={{  cursor: 'pointer' }}>Don't have an account? 
                    
                    </p>
                </form>
            </div>
        ) : (
            <div className='signup-wrapper'>
                <h2 className='title'>Sign Up on <span style={{ color: "var(--theme)" }}>Billsy</span></h2>
                <form action="">
                    <Input
                        label={"Full name"}
                        state={name}
                        setState={setName}
                        placeholder={"John Doe"}
                    />
                    <Input
                        type="email"
                        label={"Email"}
                        state={email}
                        setState={setEmail}
                        placeholder={"johndoe123@gmail.com"}
                    />
                    <Input
                        type="password"
                        label={"Password"}
                        state={password}
                        setState={setPassword}
                        placeholder={"Example123"}
                    />
                    <Input
                        type="password"
                        label={"Confirm password"}
                        state={confirmPassword}
                        setState={setConfirmPassword}
                        placeholder={"Example123"}
                    />
                    <Button
                        disabled={loading}
                        text={loading ? "Loading..." : "Sign Up Using Email and Password"}
                        onClick={signupWithEmail}
                    />
                    <p className='p-login'>OR</p>
                    <Button text={loading ? "Loading..." : "Sign Up Using Google"} blue={true} onClick={googleAuth}/>
                    
                    <p className='p-login' onClick={() => setLoginForm(!loginForm)} style={{  cursor: 'pointer' }}> Already have an account?

                    </p>
                </form>
            </div>
        )}
    </>
);
}


export default SignupSignin