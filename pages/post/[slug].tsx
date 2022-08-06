import { GetStaticProps } from "next";
import Navbar from "../../components/Navbar";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";

interface Props {
  post: Post;
}
interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

function Post({ post }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    
    await fetch("/api/createComment",{
      method: "POST",
      body: JSON.stringify(data),
    })
    .then(()=> {
      console.log(data);
    })
    .catch((err) =>{
      console.log(err)
    });
  };

  console.log(post.body);
  return (
    <main>
      <Navbar />
      {/* contenido del post */}

      <img
        className="w-full h-45 object-cover"
        src={urlFor(post.mainImage).url()!}
        alt="imagen"
      />
      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>

        {/* author stuff */}
        <div className="flex  items-center space-x-5">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()}
            alt="author-image"
          />
          <p className="font-extralight text-sm">
            Blog post by{" "}
            <span className="text-green-600">{post.author.name}</span> - Publish
            at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        {/* post body */}
        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              p: (props: any) => <p className="my-4" {...props} />,
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="text-2xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc" {...children} />
              ),
              link: ({ href, children }: any) => (
                <a
                  href={href}
                  className="text-blue-500 hover:underline"
                  {...children}
                />
              ),
            }}
          />
        </div>

        {/* ... */}
      </article>
      <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />

      {/* comentario */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
      >
        <input type="hidden" {...register("_id")} name="_id" value={post._id} />
        <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
        <h4 className="text-2xl font-bold">Leave a commnet below!</h4>
        <hr className="py-3  mt-2" />
        <label className="block mb-5">
          <span className="text-gray-700">Name</span>
          <input
            {...register("name", { required: true })}
            className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring-1"
            placeholder="John Smith"
            type="text"
          />
        </label>
        <label className="block mb-5">
          <span className="text-gray-700">Email</span>
          <input
            {...register("email", { required: true })}
            className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring-1"
            placeholder="example@mail.com"
            type="email"
          />
        </label>
        <label className="block mb-5">
          <span className="text-gray-700">Comment</span>
          <textarea
            {...register("comment", { required: true })}
            rows={6}
            className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring-1"
            placeholder="Great Post!"
          />
        </label>
        <div className="flex flex-col p-5">
          {errors.name && (
            <span className="text-red-500"> -The name Field is required! </span>
          )}
          {errors.name && (
            <span className="text-red-500">
              {" "}
              -The Comment Field is required!{" "}
            </span>
          )}
          {errors.name && (
            <span className="text-red-500">
              {" "}
              -The Email Field is required!{" "}
            </span>
          )}
        </div>

        <input
          type="submit"
          className="shadow bg-yellow-500 hover:bg-yellow-400 
                      focus:shadow-outline focus:outline-none
                    text-white font-bold py-2 px-4 rounded cursor-pointer"
        />
      </form>
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
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
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
  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post,
    },
    revalidate: 60, // re- renderizara las paginas web cada N segundos
  };
};
