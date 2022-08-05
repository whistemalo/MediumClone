import { GetStaticProps } from "next";
import Navbar from "../../components/Navbar";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";

interface Props{
  post: Post;
}

function Post( { post }: Props) {
  console.log(post)
  return (
    <main>
        <Navbar/>
    </main>
  );
}

export default Post;

export const getStaticPaths = async () => {
    const query = `*[_type == "post"]{
        _id,
        title,
        slug {
        current
      }
      }`;
      const posts = await sanityClient.fetch(query);
      const paths = posts.map ((post : Post) => ({
          params: {
              slug: post.slug.current
          }
      }));

      return {
        paths,
        fallback: 'blocking',
    };
}
 
    export const getStaticProps :  GetStaticProps = async ({ params }) =>{
      const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author ->{
        name,
        image
      },
      description,
      mainImage,
      slug,
      body,
      
      'comments': *[
       _type == "comment" &&
        post._ref == ^._id && 
        approved == true],
        description,
        mainImage,
        slug,
        body
      }`;
      const post = await sanityClient.fetch(query,{
        slug: params?.slug,
      });

      if (!post){
        return{
          notFound:true
        }
      }
      return {
        props: {
          post,
        }
      }
     
};

