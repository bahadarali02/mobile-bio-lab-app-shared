import Head from 'next/head'
import Link from 'next/link';
import { motion } from 'framer-motion'
import { 
  FaFlask, 
  FaCalendarAlt, 
  FaBarcode, 
  FaFilePdf, 
  FaUserShield, 
  FaChartLine,
  FaMicroscope,
  FaBluetoothB,
  FaUserGraduate,
  FaUserTie,
  FaClipboardCheck
} from 'react-icons/fa'

export default function Home() {
  const features = [
    {
      icon: <FaUserShield className="w-8 h-8" />,
      title: "Role-Based Access",
      description: "Secure authentication for Students, Researchers, and Lab Technicians with appropriate permissions."
    },
    {
      icon: <FaCalendarAlt className="w-8 h-8" />,
      title: "Lab Reservations",
      description: "Intuitive calendar interface to book lab time slots with real-time availability."
    },
    {
      icon: <FaBluetoothB className="w-8 h-8" />,
      title: "BLE Integration",
      description: "Connect lab devices via Bluetooth for automated data collection and sample tracking."
    },
    {
      icon: <FaFilePdf className="w-8 h-8" />,
      title: "Report Generation",
      description: "Export professional PDF reports with charts and experimental data analysis."
    }
  ]

  const steps = [
    {
      icon: <FaUserGraduate className="w-6 h-6" />,
      title: "Register Account",
      description: "Select your role (Student/Researcher/Technician) and complete your profile."
    },
    {
      icon: <FaClipboardCheck className="w-6 h-6" />,
      title: "Reserve Slot",
      description: "Book your lab time through our intuitive calendar interface."
    },
    {
      icon: <FaMicroscope className="w-6 h-6" />,
      title: "Conduct Experiment",
      description: "Use our BLE tools to log samples and record measurements."
    },
    {
      icon: <FaChartLine className="w-6 h-6" />,
      title: "Generate Report",
      description: "Export your data as PDF reports with visualizations."
    }
  ]

  const testimonials = [
    {
      quote: "Mobile Bio Lab has revolutionized how our department manages lab access and sample tracking.",
      author: "Dr. Sarah Chen, Biology Department Head"
    },
    {
      quote: "The BLE integration saves us hours of manual data entry each week. Highly recommended!",
      author: "Mark Williams, Research Assistant"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Mobile Bio Lab | Smart Laboratory Management System</title>
        <meta name="description" content="Modern solution for lab reservations, sample tracking, and report generation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Animated Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-white shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <FaFlask className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Mobile Bio Lab</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/features" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                Features
              </Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                How It Works
              </Link>
              <Link href="/documentation" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                Documentation
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors font-medium"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium shadow-sm"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Modern Lab Management, <span className="text-indigo-600">Simplified</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10"
            >
              Streamline your laboratory workflow with our all-in-one platform for reservations, sample tracking, and automated reporting.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link 
                href="/register" 
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all hover:shadow-md shadow-sm"
              >
                Get Started
              </Link>
              <Link 
                href="/demo" 
                className="px-8 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-all hover:shadow-md"
              >
                Live Demo
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for efficient lab management in one platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl border border-gray-100 hover:border-indigo-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-lg text-indigo-600 mb-4 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Workflow</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From registration to report generation in four easy steps
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 h-full w-0.5 bg-gradient-to-b from-indigo-200 to-indigo-100 transform -translate-x-1/2"></div>
            
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col lg:flex-row items-center mb-16 lg:mb-20 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                <div className="lg:w-1/2 lg:px-12 mb-8 lg:mb-0">
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center mb-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full text-indigo-600 mr-4">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 pl-14">{step.description}</p>
                  </div>
                </div>
                <div className="lg:w-1/2 lg:px-12 flex justify-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full border-4 border-indigo-100 shadow-md">
                    <span className="text-2xl font-bold text-indigo-600">{index + 1}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Researchers</h2>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              What our users say about Mobile Bio Lab
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white bg-opacity-10 p-8 rounded-xl border border-indigo-400 border-opacity-20"
              >
                <blockquote className="text-lg mb-6">"{testimonial.quote}"</blockquote>
                <p className="font-medium text-indigo-100">— {testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to transform your lab workflow?</h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Join hundreds of researchers and educators using Mobile Bio Lab today
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/register" 
                className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-all hover:shadow-md"
              >
                Create Free Account
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-transparent text-white border border-white rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-all"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <FaFlask className="h-6 w-6 text-indigo-500" />
                <span className="ml-2 text-xl font-bold text-white">Mobile Bio Lab</span>
              </div>
              <p className="text-sm">
                Modern laboratory management solution for educational and research institutions.
              </p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="/updates" className="hover:text-white transition-colors">Updates</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/tutorials" className="hover:text-white transition-colors">Tutorials</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API Reference</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Mobile Bio Lab. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-sm hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-sm hover:text-white transition-colors">Terms</Link>
              <Link href="/cookies" className="text-sm hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}