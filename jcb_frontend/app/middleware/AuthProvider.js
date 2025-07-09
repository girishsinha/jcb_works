"use client"
import React, { useEffect } from "react";
// import { redirect } from "next/navigation";
// import { useSelector } from "react-redux"
import { usePathname, useRouter } from "next/navigation";


const AuthProvider = ({ children }) => {
    const token = localStorage.getItem("token");
    console.log(token);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            if (!pathname.includes("/auth/login")) {
                if (pathname.includes("/auth/signup")) {
                    // router.push("/auth/signup")
                } else {
                    router.push("auth/login")
                }

            }

        }
    }, [pathname, token]);
    return (<>{children}</>);
}
export default AuthProvider






