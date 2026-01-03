import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Search, Eye, CheckCircle, XCircle, Clock, FileText, Download, File, ExternalLink } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type ApplicationRow = Database['public']['Tables']['applications']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type DocumentRow = Database['public']['Tables']['documents']['Row'];

type Application = ApplicationRow & {
  profiles?: Pick<ProfileRow, 'full_name' | 'email' | 'phone'> | null;
  documents?: DocumentRow[];
};

type ApplicationStatus = Database['public']['Enums']['application_status'];

const statusConfig: Record<ApplicationStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Draft", variant: "secondary" },
  submitted: { label: "Submitted", variant: "default" },
  under_review: { label: "Under Review", variant: "outline" },
  approved: { label: "Approved", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      if (!user) {
        navigate("/admin-login");
        return;
      }

      const { data: isAdmin } = await supabase.rpc('has_role', { 
        _user_id: user.id, 
        _role: 'admin' 
      });

      if (!isAdmin) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have admin privileges.",
        });
        navigate("/admin-login");
        return;
      }

      fetchApplications();
    };

    if (!authLoading) {
      checkAdminAndFetch();
    }
  }, [user, authLoading, navigate, toast]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      // Fetch applications
      const { data: appsData, error: appsError } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (appsError) throw appsError;

      // Fetch profiles for all user_ids
      const userIds = [...new Set(appsData?.map(a => a.user_id) || [])];
      const appIds = appsData?.map(a => a.id) || [];

      const [profilesResult, documentsResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("user_id, full_name, email, phone")
          .in("user_id", userIds),
        supabase
          .from("documents")
          .select("*")
          .in("application_id", appIds)
      ]);

      const profilesData = profilesResult.data;
      const documentsData = documentsResult.data;

      // Map profiles and documents to applications
      const appsWithData = (appsData || []).map(app => ({
        ...app,
        profiles: profilesData?.find(p => p.user_id === app.user_id) || null,
        documents: documentsData?.filter(d => d.application_id === app.id) || []
      }));

      setApplications(appsWithData);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch applications.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentUrl = async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(filePath, 3600); // 1 hour expiry
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get document URL.",
      });
      return null;
    }
    return data.signedUrl;
  };

  const handleViewDocument = async (doc: DocumentRow) => {
    const url = await getDocumentUrl(doc.file_url);
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleStatusUpdate = async (status: ApplicationStatus) => {
    if (!selectedApp) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("applications")
        .update({ 
          status, 
          remarks: remarks || null,
          reviewed_at: new Date().toISOString()
        })
        .eq("id", selectedApp.id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Application ${selectedApp.application_number} has been ${status.replace('_', ' ')}.`,
      });

      setIsDialogOpen(false);
      setSelectedApp(null);
      setRemarks("");
      fetchApplications();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update application status.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const generatePDF = (app: Application) => {
    const pdfContent = `
ADMISSION APPLICATION
=====================

Application Number: ${app.application_number}
Status: ${statusConfig[app.status].label}
Submitted: ${app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : 'Not submitted'}

APPLICANT DETAILS
-----------------
Name: ${app.profiles?.full_name || 'N/A'}
Email: ${app.profiles?.email || 'N/A'}
Phone: ${app.profiles?.phone || 'N/A'}

COURSE DETAILS
--------------
Course: ${app.course_name}
Preferred College: ${app.preferred_college || 'N/A'}
Stream: ${app.stream || 'N/A'}

ACADEMIC DETAILS
----------------
10th Board: ${app.board_10th || 'N/A'}
10th Percentage: ${app.percentage_10th ? app.percentage_10th + '%' : 'N/A'}
10th Year: ${app.year_10th || 'N/A'}

12th Board: ${app.board_12th || 'N/A'}
12th Percentage: ${app.percentage_12th ? app.percentage_12th + '%' : 'N/A'}
12th Year: ${app.year_12th || 'N/A'}

REMARKS
-------
${app.remarks || 'No remarks'}

Generated on: ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Application_${app.application_number}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Application Downloaded",
      description: `Application ${app.application_number} has been downloaded.`,
    });
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.application_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.course_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    submitted: applications.filter(a => a.status === 'submitted').length,
    underReview: applications.filter(a => a.status === 'under_review').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage all student applications</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{stats.submitted}</div>
              <p className="text-sm text-muted-foreground">Submitted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.underReview}</div>
              <p className="text-sm text-muted-foreground">Under Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <p className="text-sm text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, application number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredApplications.length})</CardTitle>
            <CardDescription>Click on an application to review and update status</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredApplications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No applications found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Application #</th>
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium">Course</th>
                      <th className="text-left p-3 font-medium">Submitted</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-mono text-sm">{app.application_number}</td>
                        <td className="p-3">
                          <div>{app.profiles?.full_name || 'N/A'}</div>
                          <div className="text-sm text-muted-foreground">{app.profiles?.email}</div>
                        </td>
                        <td className="p-3">{app.course_name}</td>
                        <td className="p-3 text-sm">
                          {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : '-'}
                        </td>
                        <td className="p-3">
                          <Badge variant={statusConfig[app.status].variant}>
                            {statusConfig[app.status].label}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedApp(app);
                                setRemarks(app.remarks || "");
                                setIsDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => generatePDF(app)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Review Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review Application</DialogTitle>
              <DialogDescription>
                Application #{selectedApp?.application_number}
              </DialogDescription>
            </DialogHeader>
            
            {selectedApp && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Applicant Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-muted-foreground">Name:</span> {selectedApp.profiles?.full_name || 'N/A'}</p>
                      <p><span className="text-muted-foreground">Email:</span> {selectedApp.profiles?.email || 'N/A'}</p>
                      <p><span className="text-muted-foreground">Phone:</span> {selectedApp.profiles?.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Course Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-muted-foreground">Course:</span> {selectedApp.course_name}</p>
                      <p><span className="text-muted-foreground">College:</span> {selectedApp.preferred_college || 'N/A'}</p>
                      <p><span className="text-muted-foreground">Stream:</span> {selectedApp.stream || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Academic Details</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="font-medium">Class 10th</p>
                      <p><span className="text-muted-foreground">Board:</span> {selectedApp.board_10th || 'N/A'}</p>
                      <p><span className="text-muted-foreground">Percentage:</span> {selectedApp.percentage_10th ? `${selectedApp.percentage_10th}%` : 'N/A'}</p>
                      <p><span className="text-muted-foreground">Year:</span> {selectedApp.year_10th || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Class 12th</p>
                      <p><span className="text-muted-foreground">Board:</span> {selectedApp.board_12th || 'N/A'}</p>
                      <p><span className="text-muted-foreground">Percentage:</span> {selectedApp.percentage_12th ? `${selectedApp.percentage_12th}%` : 'N/A'}</p>
                      <p><span className="text-muted-foreground">Year:</span> {selectedApp.year_12th || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Uploaded Documents</h4>
                  {selectedApp.documents && selectedApp.documents.length > 0 ? (
                    <div className="space-y-2">
                      {selectedApp.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{doc.file_name}</p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {doc.document_type.replace(/_/g, ' ')}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDocument(doc)}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No documents uploaded</p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Admin Remarks</h4>
                  <Textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add remarks or feedback for this application..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Badge variant={statusConfig[selectedApp.status].variant} className="text-sm">
                    Current: {statusConfig[selectedApp.status].label}
                  </Badge>
                </div>
              </div>
            )}

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate('under_review')}
                disabled={isUpdating}
              >
                <Clock className="h-4 w-4 mr-2" />
                Mark Under Review
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleStatusUpdate('rejected')}
                disabled={isUpdating}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => handleStatusUpdate('approved')}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
