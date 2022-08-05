import Head from 'next/head'
import Link from 'next/link'

import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../typings'

interface Props{
  posts: [Post];
}

export default function Home ({ posts }:Props)  {
  console.log(posts)
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar/> 
      <Hero/>
      {/* post */}

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 lg:p-6'>
        {posts.map((post) => 
        <Link key={post._id} href={`/post/${post.slug.current}`} >
          <div className='group cursor-pointer border rounded-lg overflow-hidden'>
            <img className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out' src={urlFor(post.mainImage).url()!} alt="" />
            <div className='flex justify-between p-5 bg-white'>
              <div >
                <p className='text-lg font-bold '>{post.title}</p>
                <p className='text-xs'>{post.description} by {post.author.name}</p>
              </div>
              <img className='h-12 w-12 rounded-full' src={urlFor(post.author.image).url()!} alt="author" />
            </div>
           
          </div>
        </Link>
       
        )}
      </div>
    </div>
  )
}


export const getServerSideProps = async () => {
  const query= `*[_type == "post"]{
    _id,
    title,
    slug,
    author -> {
    name,
    image
  },
    description,
    mainImage,
    slug
  }`;
  const posts = await sanityClient.fetch(query);
  return{
    props:{
      posts
    }
  }
};
