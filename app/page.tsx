import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Target,
  Zap
} from 'lucide-react';

export default async function HomePage() {
  // Check if user is logged in
  const session = await getSession();
  
  // If logged in, redirect to their dashboard
  if (session) {
    redirect(`/${session.role}`);
  }

  // Otherwise, show the landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InternHub
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#internships" className="text-gray-700 hover:text-blue-600 transition">Internships</a>
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
              <a href="#stats" className="text-gray-700 hover:text-blue-600 transition">Stats</a>
              <a href="#certificates" className="text-gray-700 hover:text-blue-600 transition">Certificates</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-blue-600 transition font-medium">
                Login
              </Link>
              <Link href="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition transform hover:scale-105">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  🚀 Launch Your Career Today
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your Future with
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Premium Internships</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Join thousands of students gaining real-world experience through our comprehensive internship programs. Learn, grow, and earn certificates recognized by industry leaders.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center">
                  Explore Internships
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a href="#internships" className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-blue-600 hover:text-blue-600 transition flex items-center justify-center">
                  Learn More
                </a>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">12+</div>
                  <div className="text-sm text-gray-600">Internship Programs</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Active Students</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" 
                  alt="Students collaborating" 
                  className="rounded-xl w-full h-auto"
                />
              </div>
              <div className="absolute top-10 -right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">12+</div>
              <div className="text-gray-600">Internship Programs</div>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">350+</div>
              <div className="text-gray-600">Certificates Issued</div>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Internships Section */}
      <section id="internships" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Internship Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our diverse range of industry-relevant internship programs designed to boost your career
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {internships.map((internship, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 overflow-hidden">
                <div className={`h-2 ${internship.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${internship.bgColor} flex items-center justify-center`}>
                      <internship.icon className={`h-6 w-6 ${internship.iconColor}`} />
                    </div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {internship.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{internship.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{internship.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {internship.students} students
                    </span>
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      {internship.rating}
                    </span>
                  </div>
                  <Link href="/register" className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose InternHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to succeed in your internship journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-blue-300 transition">
                <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Section */}
      <section id="certificates" className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Earn Industry-Recognized Certificates
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Complete your internship and receive a professional certificate that validates your skills and boosts your resume.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-lg">Verified digital certificates with unique verification codes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-lg">Recognized by leading companies and institutions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-lg">Shareable on LinkedIn and other professional networks</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-lg">Lifetime access to your certificate portfolio</span>
                </li>
              </ul>
              <Link href="/register" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105">
                Start Your Journey
              </Link>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform -rotate-2 hover:rotate-0 transition duration-300">
                <div className="border-8 border-blue-600 rounded-xl p-8">
                  <div className="text-center">
                    <Award className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Certificate of Completion</h3>
                    <p className="text-gray-600 mb-4">This is to certify that</p>
                    <p className="text-3xl font-bold text-blue-600 mb-4">John Doe</p>
                    <p className="text-gray-600 mb-2">has successfully completed</p>
                    <p className="text-xl font-semibold text-gray-900 mb-6">Full Stack Web Development</p>
                    <div className="border-t-2 border-gray-300 pt-4">
                      <p className="text-sm text-gray-500">Certificate No: CERT-2026-001</p>
                      <p className="text-sm text-gray-500">Issue Date: August 25, 2026</p>
                      <p className="text-sm text-gray-500 mt-2">Grade: A+ | Score: 90.5%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of successful students who transformed their careers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.program}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Internship Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students already learning and growing with InternHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105 inline-flex items-center justify-center">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/login" className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition inline-flex items-center justify-center">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold text-white">InternHub</span>
              </div>
              <p className="text-gray-400">
                Empowering students with industry-relevant internship programs and professional certificates.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Programs</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition">Web Development</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Data Science</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Mobile Development</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Digital Marketing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 InternHub. All rights reserved. Built with ❤️ for students worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const internships = [
  {
    title: 'Full Stack Web Development',
    description: 'Master MERN stack, build real-world applications, and learn modern web development practices.',
    duration: '3 months',
    students: 150,
    rating: '4.9',
    icon: BookOpen,
    color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    title: 'Data Science & ML',
    description: 'Learn Python, machine learning algorithms, and data analysis with hands-on projects.',
    duration: '4 months',
    students: 120,
    rating: '4.8',
    icon: TrendingUp,
    color: 'bg-gradient-to-r from-purple-500 to-purple-600',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    title: 'Mobile App Development',
    description: 'Build cross-platform mobile apps with React Native and publish to app stores.',
    duration: '3 months',
    students: 95,
    rating: '4.7',
    icon: Zap,
    color: 'bg-gradient-to-r from-green-500 to-green-600',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    title: 'Digital Marketing',
    description: 'Master SEO, social media marketing, content strategy, and analytics.',
    duration: '2 months',
    students: 80,
    rating: '4.8',
    icon: Target,
    color: 'bg-gradient-to-r from-orange-500 to-orange-600',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
  {
    title: 'UI/UX Design',
    description: 'Learn design thinking, prototyping, and create stunning user experiences.',
    duration: '3 months',
    students: 70,
    rating: '4.9',
    icon: Award,
    color: 'bg-gradient-to-r from-pink-500 to-pink-600',
    bgColor: 'bg-pink-100',
    iconColor: 'text-pink-600'
  },
  {
    title: 'Cloud & DevOps',
    description: 'Master AWS, Docker, Kubernetes, and modern DevOps practices.',
    duration: '3 months',
    students: 65,
    rating: '4.7',
    icon: Briefcase,
    color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  }
];

const features = [
  {
    title: 'Expert Mentorship',
    description: 'Learn from industry professionals with years of real-world experience.',
    icon: Users,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    title: 'Hands-on Projects',
    description: 'Build real-world projects that you can showcase in your portfolio.',
    icon: Briefcase,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    title: 'Flexible Learning',
    description: 'Learn at your own pace with 24/7 access to course materials.',
    icon: Clock,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    title: 'Verified Certificates',
    description: 'Earn certificates recognized by top companies worldwide.',
    icon: Award,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
  {
    title: 'Career Support',
    description: 'Get resume reviews, interview prep, and job placement assistance.',
    icon: Target,
    bgColor: 'bg-pink-100',
    iconColor: 'text-pink-600'
  },
  {
    title: 'Community Access',
    description: 'Join a vibrant community of learners and professionals.',
    icon: Users,
    bgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  }
];

const testimonials = [
  {
    name: 'Rahul Sharma',
    program: 'Full Stack Development',
    text: 'This internship transformed my career! The hands-on projects and expert mentorship helped me land my dream job at a top tech company.'
  },
  {
    name: 'Priya Patel',
    program: 'Data Science & ML',
    text: 'The curriculum is well-structured and the projects are industry-relevant. I gained practical skills that I use every day in my job.'
  },
  {
    name: 'Amit Kumar',
    program: 'Mobile Development',
    text: 'Best decision I made for my career. The certificate and portfolio projects helped me stand out in interviews and get multiple job offers.'
  }
];
