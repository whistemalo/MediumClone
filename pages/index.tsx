import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../typings'


interface Props{
  posts: [Post];
}
const Home: NextPage = ({ posts }:Props) => {
  console.log(posts)
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar/> 
      <Hero/>
     
    </div>
  )
}
export default Home

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
