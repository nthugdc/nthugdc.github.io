import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sanityClient from "../client";
import BlockContent from "@sanity/block-content-to-react";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";


const builder = imageUrlBuilder(sanityClient);
function urlFor(source : SanityImageSource) {
  return builder.image(source);
}

export default function OnePost() {
  const [postData, setPostData] = useState<any>(null);
  const { slug } = useParams();
  
  const serializers = {
    types: {
      block: (props:any) => {
        const { style = "normal" } = props.node;
  
        if (/^h\d/.test(style)) {
          const level = style.replace(/[^\d]/g, "");
          return React.createElement(
            style,
            { className: `h${level} my-3` },
            props.children
          );
        }
  
        if (style === "blockquote") {
          return <blockquote>- {props.children}</blockquote>;
        }
  
        // Fall back to default handling
        return BlockContent.defaultSerializers.types.block(props);
      },
      code: (props:any) =>
        (
          <pre data-language={props.node.language}>
            <code>{props.node.code}</code>
          </pre>
        )
    },
    
    list: (props:any) =>
      
      (props.type === "bullet" ? (
        <ul>{props.children}</ul>
      ) : (
        <ol>{props.children}</ol>
      )),
    listItem: (props:any) =>
      
      (props.type === "bullet" ? (
        <li>{props.children}</li>
      ) : (
        <li>{props.children}</li>
      )),
    marks: {
      strong: (props:any) =>
         <strong>{props.children}</strong>,
      em: (props:any) =>  <em>{props.children}</em>,
      code: (props:any) =>  <code>{props.children}</code>
    }
  };




  useEffect(() => {
    sanityClient
      .fetch(
        `*[slug.current == $slug]{
          title,
          slug,
          _createdAt,
          mainImage{
            asset->{
              _id,
              url
             }
           },
         body,
         author,
        "name": author->name,
        "authorImage": author->image
       }`,
        { slug }
      )
      .then((data) => setPostData(data[0]))
      .catch(console.error);
  }, [slug]);

  if (!postData) return <div>Loading...</div>;

  return (
    <div className = "container mx-auto px-6 md:px-6 lg:px-32 xl:px-48 bg-white grid  justify-items-center items-start  min-h-[1200px]">


      <h1 className="mt-36 text-6xl font-bold">{postData.title}</h1> {/*  Title */}
      
      <div className=" my-4 text-center"> {/*  Author */}

        <img className="border-white border-2 rounded-full object-cover my-2 w-20"
            src={postData.authorImage ? urlFor(postData.authorImage).width(100).url() : ""}
            alt=""
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src="https://i.imgur.com/PINChNm.png";
            }}

          />
          
          <h5 className="font-semibold">{postData.name}</h5>
          <h5 className="font-semibold my-1">{postData._createdAt.substring(0,10).replaceAll("-", "/")}</h5>
        </div>

        <div className="object-cover">  {/*  Main Image */}
          <img  className = "mb-5 w-[600px] border border-black rounded " src={postData.mainImage ? urlFor(postData.mainImage).url() : ""} alt="" />
        </div>
      
      <div className="w-[700px] pb-20 grid place-items-center"> {/*  Content */}
        <BlockContent
          blocks={postData.body}
          projectId={sanityClient.clientConfig.projectId}
          dataset={sanityClient.clientConfig.dataset}
          serializers={serializers}
          
          imageOptions={{ fit: 'max',justifySelf: 'center', marginTop: '100px'}}
        />
      </div>


    </div>
  );
}