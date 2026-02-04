import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { Button } from '../components/ui/button';
import { useAuth } from '../auth/useAuth';
import { Link } from 'react-router-dom';
import { Archive, Lightbulb, Target, Users, ArrowRight, Mail } from 'lucide-react';
import { Card } from '../components/ui/card';

const About = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        {/* Hero Section – Impactful with subtle cultural pattern */}
        <section className="relative bg-primary-gradient py-28 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://img.freepik.com/free-vector/ethnic-seamless-pattern-background-black-white-aztec-design-vector_53876-154221.jpg"
              alt="African cultural pattern"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-accent mb-10">
              Griote Africa
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl font-semibold text-white/90 mb-20 max-w-3xl mx-auto">
              The memory, knowledge, and African innovation united in a single ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="px-12 py-8 text-xl font-semibold bg-white text-primary hover:bg-accent/90"
                >
                  Join the community
                </Button>
              </Link>

              <Link to="/explore">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-12 py-8 text-xl font-semibold text-foreground bg-accent inline-flex items-center gap-3"
                >
                  Explore deposits
                  <ArrowRight className="w-6 h-6" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values & Team Section */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">

            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Our Mission, Vision, Values
              </h2>
              <p className="text-xl text-foreground/70 max-w-4xl mx-auto">
                Griote Project-Africa rests on a clear ambition: to make Africa a global leader in knowledge and technological innovation, while preserving and valuing its own intellectual productions.
              </p>
            </div>

            {/* Dynamic grid with integrated images */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              {/* Text column + pillars */}
              <div className="space-y-12">
                <div className="flex items-start gap-6">
                  <Archive className="w-14 h-14 text-blue-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl text-blue-500 font-bold mb-3">Preservation & Diffusion</h3>
                    <p className="text-foreground/80 text-lg">
                      Archive African academic works and make them globally accessible, so that every thesis, dissertation, or research counts and is cited.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <Lightbulb className="w-14 h-14 text-blue-500 shrink-0" />
                  <div>
                    <h3 className="text-2xl text-blue-500 font-bold mb-3">Innovation & Sovereignty</h3>
                    <p className="text-foreground/80 text-lg">
                      Develop Griote AI and open source projects trained on our knowledge and languages, for technology truly adapted to our realities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <Target className="w-14 h-14 text-blue-500 shrink-0" />
                  <div>
                    <h3 className="text-2xl text-blue-500 font-bold mb-3">Excellence & Collaboration</h3>
                    <p className="text-foreground/80 text-lg">
                      Promote African academic excellence and foster pan-African and international partnerships.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual column */}
              <div className="grid grid-cols-2 gap-6">
                <img src="https://www.shutterstock.com/image-photo/male-female-doctors-diverse-backgrounds-600nw-2673117813.jpg" alt="African researchers collaborating" className="rounded-2xl object-cover h-64 shadow-lg" />
                <img src="https://i0.wp.com/livingopensource.org/wp-content/uploads/2024/06/Living-Open-Source-training-in-Kenya.jpg?resize=1024%2C682&ssl=1" alt="Open source training in Africa" className="rounded-2xl object-cover h-64 shadow-lg mt-12" />
                <img src="https://i.natgeofe.com/n/6d15d22a-e7f9-45b1-966b-812935567f6c/RSTimbuktuLead1.jpg" alt="Timbuktu manuscripts – knowledge preservation" className="rounded-2xl object-cover h-64 shadow-lg" />
                <img src="https://c76c7bbc41.mjedge.net/wp-content/uploads/tc/2025/12/young-people-computer.jpg" alt="African youth in technological innovation" className="rounded-2xl object-cover h-64 shadow-lg mt-12" />
              </div>
            </div>

            {/* Team – Integrated for fluidity */}
            <div className="mt-24 text-center">
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-foreground">
                A Committed Team
              </h2>
              <div className="max-w-4xl mx-auto">
                <Link to="/about/executive-board">
                  <Card className="relative overflow-hidden rounded-3xl border border-border group hover:shadow-2xl transition-all">

                    <img
                      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1600&auto=format&fit=crop"
                      alt="African team in meeting"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-black/60" />

                    <div className="relative z-10 p-12 lg:p-16 flex flex-col items-center text-center">
                      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <Users className="w-10 h-10 text-white" />
                      </div>

                      <h3 className="text-3xl font-bold text-white mb-4">
                        Executive Board
                      </h3>

                      <p className="text-white/90 text-lg max-w-xl mb-6">
                        Leads the vision and key decisions of the project.
                      </p>

                      <span className="inline-flex items-center gap-2 text-blue-400 font-semibold text-lg group-hover:translate-x-2 group-hover:text-blue-300 transition-transform">
                        Discover the team
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </div>
                  </Card>
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* Final Call to Action */}
        <section className="relative bg-primary-gradient py-28 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://img.freepik.com/free-vector/ethnic-seamless-pattern-background-black-white-aztec-design-vector_53876-154221.jpg"
              alt="African cultural pattern"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-4 text-center max-w-5xl">

            <h2 className="text-4xl lg:text-6xl font-extrabold text-accent mb-8">
              Join & Contribute to African Knowledge
            </h2>

            <p className="text-xl font-black lg:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
              An open space for all who produce and value African knowledge.
              Researchers, students, professionals: your contribution matters.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {/* Primary button */}
              <Link to="/signup">
                <Button
                  className="px-12 py-8 text-2xl font-bold bg-white text-primary hover:bg-accent hover:text-primary transition-all inline-flex items-center gap-3"
                >
                  Get Started
                  <ArrowRight className="w-20 h-6" />
                </Button>
              </Link>

              {/* Secondary button */}
              <Link to="/contact">
                <Button
                  variant="outline"
                  className="px-12 py-8 text-xl font-semibold text-foreground bg-accent inline-flex items-center gap-3"
                >
                  Contact Us
                  <Mail className="w-12 h-12" />
                </Button>
              </Link>

            </div>
          </div>
        </section>

      </main>

    </div>
  );
};

export default About;
