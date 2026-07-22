import Nav from "./components/Nav";
import HeroScene from "./components/HeroScene";
import DockerHarbor from "./components/DockerHarbor";
import K8sIslandsSection from "./components/K8sIslandsSection";
import MonitoringCity from "./components/MonitoringCity";
import AIAssistantPanel from "./components/AIAssistantPanel";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div id="top" className="min-h-screen bg-void">
      <Nav />

      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <p className="font-mono text-xs text-k8s uppercase tracking-widest mb-4">
          The first AI-powered 3D DevOps operating system
        </p>
        <h1 className="font-display text-4xl md:text-6xl leading-[1.05] text-mist max-w-3xl mb-6">
          Your infrastructure, as a living world.
        </h1>
        <p className="text-fog max-w-xl mb-10">
          Kubernetes namespaces become islands. Containers become ships. Deployments become
          rockets. Watch your GitHub push travel all the way from commit to cluster below.
        </p>
        <HeroScene />
      </section>

      <DockerHarbor />
      <K8sIslandsSection />
      <MonitoringCity />
      <AIAssistantPanel />
      <Footer />
    </div>
  );
}
