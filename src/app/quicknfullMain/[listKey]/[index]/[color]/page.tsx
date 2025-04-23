import React, { Suspense } from "react";
import QuicknfullMainParams from "./quicknfullMainParams";

export const metadata = {
    title: "Quick'n'Full | Galería Principal" };

const Page: React.FC = () => {
    return React.createElement(Suspense, { fallback: null },
                React.createElement(QuicknfullMainParams, null) ) };

export default Page;
