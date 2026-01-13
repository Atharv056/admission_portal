import { Card } from "@/components/ui/card";
import { UserPlus, FileSearch, Download, Award, BookOpen, HelpCircle, CreditCard, FileText } from "lucide-react";
const quickLinks = [{
  icon: UserPlus,
  title: "New Registration",
  description: "Start your application process",
  color: "bg-primary/10 text-primary"
}, {
  icon: FileSearch,
  title: "Application Status",
  description: "Track your application",
  color: "bg-secondary/10 text-secondary"
}, {
  icon: Download,
  title: "Download Admit Card",
  description: "Get your exam admit card",
  color: "bg-accent/10 text-accent"
}, {
  icon: Award,
  title: "Check Results",
  description: "View merit lists & results",
  color: "bg-primary/10 text-primary"
}, {
  icon: CreditCard,
  title: "Fee Payment",
  description: "Pay admission fees online",
  color: "bg-secondary/10 text-secondary"
}, {
  icon: FileText,
  title: "Documents Required",
  description: "List of required documents",
  color: "bg-accent/10 text-accent"
}, {
  icon: BookOpen,
  title: "Course Information",
  description: "Explore available courses",
  color: "bg-primary/10 text-primary"
}, {
  icon: HelpCircle,
  title: "Help & Support",
  description: "FAQs and contact support",
  color: "bg-secondary/10 text-secondary"
}];
export const QuickLinksSection = () => {
  return <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">Quick Access</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access important services and information with just one click
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => {
          const Icon = link.icon;
          return <Card key={index} className="p-6 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group border-0 bg-card animate-in zoom-in" style={{
            animationDelay: `${index * 50}ms`
          }}>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className={`h-16 w-16 rounded-2xl ${link.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-neutral-100" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Card>;
        })}
        </div>
      </div>
    </section>;
};