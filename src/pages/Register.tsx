import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ChevronLeft, ChevronRight, Check, Upload } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { personalInfoSchema, academicInfoSchema, courseInfoSchema } from "@/lib/validations";

type DocumentType = Database['public']['Enums']['document_type'];

const courses = [
  "B.Tech Computer Science",
  "B.Tech Electronics",
  "B.Tech Mechanical",
  "B.Tech Civil",
  "B.Sc Physics",
  "B.Sc Chemistry",
  "B.Sc Mathematics",
  "B.Com",
  "BBA",
];

const boards = ["CBSE", "ICSE", "State Board", "IB", "Other"];
const streams = ["Science", "Commerce", "Arts"];

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Personal Info
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Academic Info
  const [academicInfo, setAcademicInfo] = useState({
    board10th: "",
    percentage10th: "",
    year10th: "",
    board12th: "",
    percentage12th: "",
    year12th: "",
    stream: "",
  });

  // Course Selection
  const [courseInfo, setCourseInfo] = useState({
    courseName: "",
    preferredCollege: "",
  });

  // Documents
  const [documents, setDocuments] = useState<{ type: DocumentType; file: File | null }[]>([
    { type: "photo", file: null },
    { type: "id_proof", file: null },
    { type: "marksheet_10th", file: null },
    { type: "marksheet_12th", file: null },
  ]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (data) {
        setPersonalInfo({
          fullName: data.full_name || "",
          phone: data.phone || "",
          dateOfBirth: data.date_of_birth || "",
          gender: data.gender || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
        });
      }
    };
    loadProfile();
  }, [user]);

  const saveApplication = async (submit = false) => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Update profile
      await supabase.from("profiles").update({
        full_name: personalInfo.fullName,
        phone: personalInfo.phone,
        date_of_birth: personalInfo.dateOfBirth || null,
        gender: personalInfo.gender,
        address: personalInfo.address,
        city: personalInfo.city,
        state: personalInfo.state,
        pincode: personalInfo.pincode,
      }).eq("user_id", user.id);

      // Create or update application
      let appId = applicationId;
      if (applicationId) {
        await supabase.from("applications").update({
          course_name: courseInfo.courseName,
          preferred_college: courseInfo.preferredCollege,
          board_10th: academicInfo.board10th,
          percentage_10th: academicInfo.percentage10th ? parseFloat(academicInfo.percentage10th) : null,
          year_10th: academicInfo.year10th ? parseInt(academicInfo.year10th) : null,
          board_12th: academicInfo.board12th,
          percentage_12th: academicInfo.percentage12th ? parseFloat(academicInfo.percentage12th) : null,
          year_12th: academicInfo.year12th ? parseInt(academicInfo.year12th) : null,
          stream: academicInfo.stream,
          status: submit ? "submitted" as const : "draft" as const,
          submitted_at: submit ? new Date().toISOString() : null,
        }).eq("id", applicationId);
      } else if (courseInfo.courseName) {
        const { data, error } = await supabase.from("applications").insert([{
          user_id: user.id,
          application_number: `APP${Date.now()}`,
          course_name: courseInfo.courseName,
          preferred_college: courseInfo.preferredCollege || null,
          board_10th: academicInfo.board10th || null,
          percentage_10th: academicInfo.percentage10th ? parseFloat(academicInfo.percentage10th) : null,
          year_10th: academicInfo.year10th ? parseInt(academicInfo.year10th) : null,
          board_12th: academicInfo.board12th || null,
          percentage_12th: academicInfo.percentage12th ? parseFloat(academicInfo.percentage12th) : null,
          year_12th: academicInfo.year12th ? parseInt(academicInfo.year12th) : null,
          stream: academicInfo.stream || null,
          status: submit ? "submitted" as const : "draft" as const,
          submitted_at: submit ? new Date().toISOString() : null,
        }]).select().single();
        if (error) throw error;
        appId = data.id;
        setApplicationId(data.id);
      }

      // Upload documents
      if (appId) {
        for (const doc of documents) {
          if (doc.file) {
            const fileName = `${user.id}/${appId}/${doc.type}_${Date.now()}`;
            const { error: uploadError } = await supabase.storage
              .from("documents")
              .upload(fileName, doc.file);

            if (!uploadError) {
              // Store the file path instead of public URL for security
              // Documents will be accessed via signed URLs when needed
              await supabase.from("documents").insert({
                application_id: appId,
                user_id: user.id,
                document_type: doc.type,
                file_name: doc.file.name,
                file_url: fileName, // Store path, not public URL
              });
            }
          }
        }
      }

      if (submit) {
        toast({
          title: "Application Submitted!",
          description: "Your application has been submitted successfully.",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Progress Saved",
          description: "Your application has been saved as draft.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save application. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (type: DocumentType, file: File | null) => {
    setDocuments(prev => prev.map(d => d.type === type ? { ...d, file } : d));
  };

  const validateStep = (stepNum: number): boolean => {
    setValidationErrors({});
    
    try {
      if (stepNum === 1) {
        personalInfoSchema.parse(personalInfo);
      } else if (stepNum === 2) {
        academicInfoSchema.parse(academicInfo);
      } else if (stepNum === 3) {
        courseInfoSchema.parse(courseInfo);
      }
      return true;
    } catch (error: any) {
      if (error.errors) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        setValidationErrors(errors);
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fix the highlighted errors before proceeding.",
        });
      }
      return false;
    }
  };

  const nextStep = () => {
    if (validateStep(step) && step < 5) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const steps = [
    { num: 1, label: "Personal Info" },
    { num: 2, label: "Academic Details" },
    { num: 3, label: "Course Selection" },
    { num: 4, label: "Documents" },
    { num: 5, label: "Review & Submit" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admission Application</h1>
          <p className="text-muted-foreground mb-8">Complete all steps to submit your application</p>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-medium ${
                  step >= s.num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {step > s.num ? <Check className="h-5 w-5" /> : s.num}
                </div>
                <span className={`ml-2 text-sm hidden md:block ${
                  step >= s.num ? "text-foreground" : "text-muted-foreground"
                }`}>{s.label}</span>
                {i < steps.length - 1 && (
                  <div className={`w-8 md:w-16 h-1 mx-2 ${
                    step > s.num ? "bg-primary" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>

          <Card>
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Enter your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input
                        value={personalInfo.fullName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                        placeholder="Enter your full name"
                        className={validationErrors.fullName ? "border-destructive" : ""}
                      />
                      {validationErrors.fullName && (
                        <p className="text-sm text-destructive">{validationErrors.fullName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number (10 digits)</Label>
                      <Input
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                        placeholder="Enter phone number"
                        maxLength={10}
                        className={validationErrors.phone ? "border-destructive" : ""}
                      />
                      {validationErrors.phone && (
                        <p className="text-sm text-destructive">{validationErrors.phone}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={personalInfo.dateOfBirth}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select value={personalInfo.gender} onValueChange={(v) => setPersonalInfo({ ...personalInfo, gender: v })}>
                        <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea
                      value={personalInfo.address}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                      placeholder="Enter your address"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        value={personalInfo.city}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })}
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input
                        value={personalInfo.state}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, state: e.target.value })}
                        placeholder="State"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pincode (6 digits)</Label>
                      <Input
                        value={personalInfo.pincode}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, pincode: e.target.value })}
                        placeholder="Pincode"
                        maxLength={6}
                        className={validationErrors.pincode ? "border-destructive" : ""}
                      />
                      {validationErrors.pincode && (
                        <p className="text-sm text-destructive">{validationErrors.pincode}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 2: Academic Details */}
            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle>Academic Details</CardTitle>
                  <CardDescription>Enter your academic information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Class 10th Details</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Board</Label>
                        <Select value={academicInfo.board10th} onValueChange={(v) => setAcademicInfo({ ...academicInfo, board10th: v })}>
                          <SelectTrigger><SelectValue placeholder="Select board" /></SelectTrigger>
                          <SelectContent>
                            {boards.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Percentage (0-100)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={academicInfo.percentage10th}
                          onChange={(e) => setAcademicInfo({ ...academicInfo, percentage10th: e.target.value })}
                          placeholder="e.g., 85.5"
                          className={validationErrors.percentage10th ? "border-destructive" : ""}
                        />
                        {validationErrors.percentage10th && (
                          <p className="text-sm text-destructive">{validationErrors.percentage10th}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Year of Passing</Label>
                        <Input
                          type="number"
                          min="1950"
                          max={new Date().getFullYear() + 1}
                          value={academicInfo.year10th}
                          onChange={(e) => setAcademicInfo({ ...academicInfo, year10th: e.target.value })}
                          placeholder="e.g., 2022"
                          className={validationErrors.year10th ? "border-destructive" : ""}
                        />
                        {validationErrors.year10th && (
                          <p className="text-sm text-destructive">{validationErrors.year10th}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-4">Class 12th Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Board</Label>
                        <Select value={academicInfo.board12th} onValueChange={(v) => setAcademicInfo({ ...academicInfo, board12th: v })}>
                          <SelectTrigger><SelectValue placeholder="Select board" /></SelectTrigger>
                          <SelectContent>
                            {boards.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Stream</Label>
                        <Select value={academicInfo.stream} onValueChange={(v) => setAcademicInfo({ ...academicInfo, stream: v })}>
                          <SelectTrigger><SelectValue placeholder="Select stream" /></SelectTrigger>
                          <SelectContent>
                            {streams.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Percentage (0-100)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={academicInfo.percentage12th}
                          onChange={(e) => setAcademicInfo({ ...academicInfo, percentage12th: e.target.value })}
                          placeholder="e.g., 90.0"
                          className={validationErrors.percentage12th ? "border-destructive" : ""}
                        />
                        {validationErrors.percentage12th && (
                          <p className="text-sm text-destructive">{validationErrors.percentage12th}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Year of Passing</Label>
                        <Input
                          type="number"
                          min="1950"
                          max={new Date().getFullYear() + 1}
                          value={academicInfo.year12th}
                          onChange={(e) => setAcademicInfo({ ...academicInfo, year12th: e.target.value })}
                          placeholder="e.g., 2024"
                          className={validationErrors.year12th ? "border-destructive" : ""}
                        />
                        {validationErrors.year12th && (
                          <p className="text-sm text-destructive">{validationErrors.year12th}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 3: Course Selection */}
            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle>Course Selection</CardTitle>
                  <CardDescription>Select your preferred course and college</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Course *</Label>
                    <Select value={courseInfo.courseName} onValueChange={(v) => setCourseInfo({ ...courseInfo, courseName: v })}>
                      <SelectTrigger className={validationErrors.courseName ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {validationErrors.courseName && (
                      <p className="text-sm text-destructive">{validationErrors.courseName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred College (Optional)</Label>
                    <Input
                      value={courseInfo.preferredCollege}
                      onChange={(e) => setCourseInfo({ ...courseInfo, preferredCollege: e.target.value })}
                      placeholder="Enter your preferred college"
                    />
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 4: Documents */}
            {step === 4 && (
              <>
                <CardHeader>
                  <CardTitle>Upload Documents</CardTitle>
                  <CardDescription>Upload required documents (PDF, JPG, PNG - Max 5MB each)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.type} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium capitalize">{doc.type.replace("_", " ")}</p>
                        {doc.file && <p className="text-sm text-muted-foreground">{doc.file.name}</p>}
                      </div>
                      <label className="cursor-pointer">
                        <Input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(doc.type, e.target.files?.[0] || null)}
                        />
                        <Button type="button" variant={doc.file ? "secondary" : "outline"} asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            {doc.file ? "Change" : "Upload"}
                          </span>
                        </Button>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </>
            )}

            {/* Step 5: Review */}
            {step === 5 && (
              <>
                <CardHeader>
                  <CardTitle>Review Your Application</CardTitle>
                  <CardDescription>Please review all information before submitting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <p><span className="text-muted-foreground">Name:</span> {personalInfo.fullName}</p>
                      <p><span className="text-muted-foreground">Phone:</span> {personalInfo.phone}</p>
                      <p><span className="text-muted-foreground">DOB:</span> {personalInfo.dateOfBirth}</p>
                      <p><span className="text-muted-foreground">Gender:</span> {personalInfo.gender}</p>
                      <p className="md:col-span-2"><span className="text-muted-foreground">Address:</span> {personalInfo.address}, {personalInfo.city}, {personalInfo.state} - {personalInfo.pincode}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Academic Details</h3>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <p><span className="text-muted-foreground">10th Board:</span> {academicInfo.board10th} ({academicInfo.percentage10th}%, {academicInfo.year10th})</p>
                      <p><span className="text-muted-foreground">12th Board:</span> {academicInfo.board12th} ({academicInfo.percentage12th}%, {academicInfo.year12th})</p>
                      <p><span className="text-muted-foreground">Stream:</span> {academicInfo.stream}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Course Selection</h3>
                    <div className="text-sm">
                      <p><span className="text-muted-foreground">Course:</span> {courseInfo.courseName}</p>
                      {courseInfo.preferredCollege && <p><span className="text-muted-foreground">Preferred College:</span> {courseInfo.preferredCollege}</p>}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Documents</h3>
                    <div className="flex flex-wrap gap-2">
                      {documents.map(doc => (
                        <span key={doc.type} className={`px-3 py-1 rounded-full text-sm ${doc.file ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                          {doc.type.replace("_", " ")} {doc.file ? "✓" : "✗"}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between p-6 border-t">
              <Button variant="outline" onClick={prevStep} disabled={step === 1 || isLoading}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => saveApplication(false)} disabled={isLoading}>
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Save Draft
                </Button>
                {step < 5 ? (
                  <Button onClick={nextStep}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={() => saveApplication(true)} disabled={isLoading || !courseInfo.courseName}>
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Submit Application
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
