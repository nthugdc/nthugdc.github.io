import React from "react";
import AllPosts from "../AllPosts";
import OnePost from "../OnePost";
import AnimatedText from "../AnimatedText";

export default function ArticlesPage(){
    // TODO
    return (
        <div className = "container mx-auto px-6 md:px-6 lg:px-32 xl:px-48 bg-white ">
            
            <AnimatedText title="Articles"></AnimatedText>
                {/* <h1 className="heading text-4xl md:text-6xl font-bold font-sans md:leading-tight text-center text-cyan-600">
                    Test
                </h1> */}
            <AllPosts category=""></AllPosts>

        </div>
            
    );
}