import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

const blogsData = [
  {
    title: "Redmine Project Management: The Future of Open-Source Tools",
    date: "28 Aug",
    image: "https://learnerskart.com/wp-content/uploads/2025/08/Redmine-Project-Management-Learnerskart-1.jpg",
    excerpt: "When professionals think of project management tools, names like Jira, Trello, Asana usually come up. However, there's a powerful open-source alternative..."
  },
  {
    title: "AI & Automation in Project Management – Future of Work",
    date: "18 Aug",
    image: "https://learnerskart.com/wp-content/uploads/2025/08/AI-Automation-in-Project-Management-Learnerskart-1.jpg",
    excerpt: "The project management landscape is undergoing a massive transformation. AI & Automation is now at the forefront..."
  },
  {
    title: "The Hidden Challenge: What to Do When a Critical Project Resource Leaves?",
    date: "08 Aug",
    image: "https://learnerskart.com/wp-content/uploads/2025/08/ChatGPT-Image-Aug-8-2025-10_02_22-AM-2-1.png",
    excerpt: "Every successful project relies on key contributors—those professionals whose sudden exit can derail even well-planned projects..."
  },
  {
    title: "Does Google have a Project Management tool?",
    date: "07 Aug",
    image: "https://learnerskart.com/wp-content/uploads/2025/08/Google-Workspace-for-Project-Management-Learnerskart.png",
    excerpt: "When most people think of project management tools, they imagine platforms like Trello, Asana, or Microsoft Project..."
  }
];

export default function BlogSection() {
  return (
    <section id="blogs" className="w-full bg-gray-50/50 py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl text-left">
            <span className="text-xs font-black uppercase tracking-wider text-[#f97316] bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-100 shadow-sm">
              Latest Insights
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0a3d91] tracking-tight mt-3 font-sans">
              Our Latest Blogs
            </h2>
            <p className="text-sm text-gray-500 mt-2 font-semibold">
              Stay ahead in your industry with our curated insights, advice, and trends from professional trainers
            </p>
          </div>
          
          <a 
            href="#contact" 
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0a3d91] hover:text-[#f97316] transition-colors group"
          >
            Explore All Articles
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogsData.map((blog, idx) => (
            <article 
              key={idx}
              className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group"
            >
              {/* Blog Image & Date Badge */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop";
                  }}
                />
                
                {/* Date Badge */}
                <div className="absolute bottom-3 left-3 bg-[#0a3d91] text-white rounded-xl py-2 px-3 shadow-md flex flex-col items-center justify-center border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-black tracking-wider leading-none">
                    {blog.date.split(' ')[1]}
                  </span>
                  <span className="text-base font-black tracking-tighter leading-none mt-1">
                    {blog.date.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Blog Body Content */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                <div className="space-y-3">
                  {/* Category Placeholder Icon / Info */}
                  <div className="flex items-center gap-1.5 text-xxs font-black uppercase tracking-wider text-[#f97316]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Project Management</span>
                  </div>
                  
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0a3d91] leading-snug group-hover:text-[#f97316] transition-colors duration-200 line-clamp-2 min-h-[3rem]">
                    {blog.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-3">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-50 mt-4">
                  <a 
                    href="#contact"
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#0a3d91] hover:text-[#f97316] group/link"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-200" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
