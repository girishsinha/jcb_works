"use client"
import React, { useEffect } from "react";
// import { redirect } from "next/navigation";
import { useSelector } from "react-redux"
import { usePathname, useRouter } from "next/navigation";


const AuthProvider = ({ children }) => {
    const token = localStorage.getItem("token");
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            if (!pathname.includes("/Login")) {
                if (pathname.includes("/signup")) {
                    router.push("/signup")
                } else {
                    router.push("/Login")
                }

            }

        }
    }, [pathname, token]);
    return (<>{children}</>);
}
export default AuthProvider






