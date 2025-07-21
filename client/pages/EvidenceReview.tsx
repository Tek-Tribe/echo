import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  CheckCircle,
  X,
  Eye,
  ExternalLink,
  Calendar,
  User,
  AlertTriangle,
} from "lucide-react";
import { EchoCoinIcon } from "@/components/EchoCoinIcon";

interface EvidenceSubmission {
  id: string;
  campaignId: string;
  campaignTitle: string;
  influencerName: string;
  influencerAvatar: string;
  influencerHandle: string;
  echoCoins: number;
  submittedAt: string;
  evidence: {
    screenshots: string[];
    links: string[];
    description: string;
  };
  status: "pending" | "approved" | "rejected";
}

export default function EvidenceReview() {
  const [selectedSubmission, setSelectedSubmission] =
    useState<EvidenceSubmission | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const [submissions] = useState<EvidenceSubmission[]>([
    {
      id: "1",
      campaignId: "3",
      campaignTitle: "Fitness Supplement Review",
      influencerName: "Emma Wellness",
      influencerAvatar: "/placeholder.svg",
      influencerHandle: "@emmawellness",
      echoCoins: 450,
      submittedAt: "2024-01-20",
      evidence: {
        screenshots: ["/placeholder.svg", "/placeholder.svg"],
        links: [
          "https://instagram.com/p/example123",
          "https://instagram.com/stories/highlights/123",
        ],
        description:
          "Posted on my main feed with authentic review. Received great engagement from my fitness community. The post shows me using the product during my morning routine and includes honest feedback about taste and effectiveness.",
      },
      status: "pending",
    },
    {
      id: "2",
      campaignId: "2",
      campaignTitle: "Product Review Video",
      influencerName: "Mike Strong",
      influencerAvatar: "/placeholder.svg",
      influencerHandle: "@mikestrong",
      echoCoins: 1200,
      submittedAt: "2024-01-19",
      evidence: {
        screenshots: ["/placeholder.svg"],
        links: ["https://instagram.com/p/video-review-456"],
        description:
          "Created a comprehensive 90-second unboxing and review video. Highlighted all key features as requested and showed genuine reactions. Video has already received 2.5K views and 300+ likes with positive comments about the product.",
      },
      status: "approved",
    },
  ]);

  const handleApprove = (submissionId: string) => {
    // Handle approval logic here
    console.log("Approved submission:", submissionId);
    setSelectedSubmission(null);
    setReviewNotes("");
  };

  const handleReject = (submissionId: string) => {
    // Handle rejection logic here
    console.log("Rejected submission:", submissionId, "Notes:", reviewNotes);
    setSelectedSubmission(null);
    setReviewNotes("");
  };

  const pendingSubmissions = submissions.filter(
    (sub) => sub.status === "pending",
  );
  const reviewedSubmissions = submissions.filter(
    (sub) => sub.status !== "pending",
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-gradient-to rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Echo</span>
              </Link>
              <nav className="hidden md:flex ml-8 space-x-8">
                <a
                  href="#"
                  className="text-brand-600 border-b-2 border-brand-600 pb-4 text-sm font-medium"
                >
                  Evidence Review
                </a>
              </nav>
            </div>
            <Link to="/business-dashboard">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Evidence Review
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Review and approve influencer campaign submissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-3 sm:ml-4 min-w-0">
                  <div className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                    Pending Review
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">
                    {pendingSubmissions.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">
                    Approved
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {
                      reviewedSubmissions.filter((s) => s.status === "approved")
                        .length
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                    <EchoCoinIcon className="h-6 w-6 text-brand-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">
                    Pending Payout
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {reviewedSubmissions
                      .filter((s) => s.status === "approved")
                      .reduce((sum, s) => sum + s.echoCoins, 0)
                      .toLocaleString()} EC
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Submissions */}
        {pendingSubmissions.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Pending Reviews
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {pendingSubmissions.map((submission) => (
                <Card
                  key={submission.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                          <AvatarImage src={submission.influencerAvatar} />
                          <AvatarFallback>
                            {submission.influencerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {submission.campaignTitle}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {submission.influencerName} (
                            {submission.influencerHandle})
                          </p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col sm:text-right items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1">
                        <div className="text-lg sm:text-xl font-bold text-green-600">
                          ${submission.amount}
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Pending Review
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-3 sm:mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                        Submission Description
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {submission.evidence.description}
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2 text-xs sm:text-sm">
                          Screenshots ({submission.evidence.screenshots.length})
                        </h5>
                        <div className="flex gap-1 sm:gap-2">
                          {submission.evidence.screenshots.map(
                            (screenshot, index) => (
                              <div
                                key={index}
                                className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex items-center justify-center"
                              >
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2 text-xs sm:text-sm">
                          Post Links
                        </h5>
                        <div className="space-y-1">
                          {submission.evidence.links.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs sm:text-sm text-brand-600 hover:text-brand-700"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Post {index + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        Submitted{" "}
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button
                        onClick={() => setSelectedSubmission(submission)}
                        className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Review in Detail
                      </Button>
                      <Button
                        onClick={() => handleApprove(submission.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 text-xs sm:text-sm"
                      >
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Quick Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Reviewed Submissions */}
        {reviewedSubmissions.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recently Reviewed
            </h2>
            <div className="space-y-4">
              {reviewedSubmissions.map((submission) => (
                <Card key={submission.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={submission.influencerAvatar} />
                          <AvatarFallback>
                            {submission.influencerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {submission.campaignTitle}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {submission.influencerName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          ${submission.amount}
                        </div>
                        <Badge
                          className={
                            submission.status === "approved"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {submission.status === "approved" && (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          )}
                          {submission.status === "rejected" && (
                            <X className="h-3 w-3 mr-1" />
                          )}
                          {submission.status === "approved"
                            ? "Approved"
                            : "Rejected"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Review Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                Review Evidence: {selectedSubmission.campaignTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Influencer Details
                  </h4>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedSubmission.influencerAvatar} />
                      <AvatarFallback>
                        {selectedSubmission.influencerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {selectedSubmission.influencerName}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {selectedSubmission.influencerHandle}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Campaign:</span>
                      <span className="font-medium">
                        {selectedSubmission.campaignTitle}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-medium text-green-600">
                        ${selectedSubmission.amount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Submitted:</span>
                      <span className="font-medium">
                        {new Date(
                          selectedSubmission.submittedAt,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Evidence Links
                  </h4>
                  <div className="space-y-2">
                    {selectedSubmission.evidence.links.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        <ExternalLink className="h-4 w-4 text-brand-600" />
                        <span className="text-brand-600 hover:text-brand-700">
                          Post {index + 1}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Submission Description
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    {selectedSubmission.evidence.description}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Screenshots
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedSubmission.evidence.screenshots.map(
                    (screenshot, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                      >
                        <Eye className="h-8 w-8 text-gray-400" />
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Review Notes (Optional)
                </h4>
                <Textarea
                  placeholder="Add any feedback or notes for the influencer..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => handleApprove(selectedSubmission.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve & Process Payment
                </Button>
                <Button
                  onClick={() => handleReject(selectedSubmission.id)}
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject Submission
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSubmission(null);
                    setReviewNotes("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
