import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import BlogTemplate from '@/components/BlogTemplate';
import { egyptDestinationsBlogs, getBlogBySlug } from '@/data/egyptDestinationsBlogs';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static routes for all destination blogs to ensure fast loading speeds
export async function generateStaticParams() {
  return egyptDestinationsBlogs.map((blog) => ({
    slug: blog.slug,
  }));
}

// Dynamically generate Google SEO optimized metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  
  if (!blog) {
    return {
      title: 'Egypt Travel Guide Not Found | Black Pyramids Tours',
      description: 'The requested luxury Egypt travel guide could not be found.',
    };
  }

  return {
    title: `${blog.titleEn} | Black Pyramids Tours`,
    description: blog.metaDescriptionEn,
    keywords: blog.keywordsEn,
    openGraph: {
      title: blog.titleEn,
      description: blog.metaDescriptionEn,
      images: [{ url: blog.heroImage, width: 1200, height: 630 }],
      type: 'article',
    },
    alternates: {
      canonical: `https://blackpyramidsgateway.com/blog/${blog.slug}`,
    },
  };
}

export default async function DestinationBlogPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', color: '#fff' }}>
      <Navbar />
      <BlogTemplate blog={blog} />
    </div>
  );
}
