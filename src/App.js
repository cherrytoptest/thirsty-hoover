import { useState, useRef } from "react";
import { FileSignature, Check, X, Download, RefreshCw, Send } from "lucide-react";
import { Button } from "/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "/components/ui/dialog";
import { Separator } from "/components/ui/separator";
import { Badge } from "/components/ui/badge";
import { Progress } from "/components/ui/progress";

export default function ESignatureDemo() {
  const [activeTab, setActiveTab] = useState("documents");
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [signatureMode, setSignatureMode] = useState("draw");
  const [signature, setSignature] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [signedDocuments, setSignedDocuments] = useState([]);
  const [progress, setProgress] = useState(0);
  const [sending, setSending] = useState(false);
  
  const canvasRef = useRef(null);
  const [canvasCtx, setCanvasCtx] = useState(null);
  const [canvasPoints, setCanvasPoints] = useState([]);
  
  const documents = [
    { id: 1, title: "Contract Agreement", status: "Pending", date: "2023-10-25", priority: "High" },
    { id: 2, title: "Service Proposal", status: "Pending", date: "2023-10-26", priority: "Medium" },
    { id: 3, title: "Non-Disclosure Agreement", status: "Pending", date: "2023-10-27", priority: "Low" }
  ];
  
  const initializeCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#1a56db";
      setCanvasCtx(ctx);
      setCanvasPoints([]);
      clearCanvas();
    }
  };
  
  const clearCanvas = () => {
    if (canvasCtx) {
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setCanvasPoints([]);
      setSignature(null);
    }
  };
  
  const startDrawing = (e) => {
    if (!canvasCtx) return;
    
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    canvasCtx.beginPath();
    canvasCtx.moveTo(x, y);
    setCanvasPoints([...canvasPoints, { x, y, type: "start" }]);
  };
  
  const draw = (e) => {
    if (!isDrawing || !canvasCtx) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    canvasCtx.lineTo(x, y);
    canvasCtx.stroke();
    setCanvasPoints([...canvasPoints, { x, y, type: "draw" }]);
  };
  
  const stopDrawing = () => {
    if (!canvasCtx) return;
    
    setIsDrawing(false);
    canvasCtx.closePath();
    setSignature(canvasRef.current.toDataURL());
  };
  
  const openSignatureDialog = (document) => {
    setCurrentDocument(document);
    setShowSignatureDialog(true);
    setTimeout(initializeCanvas, 100);
  };
  
  const handleSignDocument = () => {
    if (!signature) return;
    
    setShowSignatureDialog(false);
    
    // Simulate document signing process
    setSending(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setSending(false);
        setSignedDocuments([...signedDocuments, currentDocument]);
        setProgress(0);
      }
    }, 100);
  };
  
  const typeSignature = (e) => {
    setSignature(e.target.value);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white border-b border-gray-200 shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileSignature className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SignFlow</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
              Pro Account
            </Badge>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">E-Signature Solution</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Eliminate the need for physical signatures. Sign documents remotely and securely,
            speeding up turnaround time and improving workflow efficiency.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="signed">Signed</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {documents.filter(doc => !signedDocuments.includes(doc)).map((document) => (
                <Card key={document.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{document.title}</CardTitle>
                        <CardDescription>Date: {document.date}</CardDescription>
                      </div>
                      <Badge className={
                        document.priority === "High" ? "bg-red-100 text-red-800 border-red-200" :
                        document.priority === "Medium" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                        "bg-green-100 text-green-800 border-green-200"
                      }>
                        {document.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-gray-100 rounded-md flex items-center justify-center">
                      <span className="text-gray-400">Document preview</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        {document.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" onClick={() => openSignatureDialog(document)}>
                        <FileSignature className="h-4 w-4 mr-1" />
                        Sign Now
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
              
              {documents.filter(doc => !signedDocuments.includes(doc)).length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">All documents signed!</h3>
                  <p className="text-gray-600">You have no pending documents to sign.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="signed" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {signedDocuments.map((document) => (
                <Card key={document.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{document.title}</CardTitle>
                        <CardDescription>Signed on: {new Date().toLocaleDateString()}</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Signed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-gray-100 rounded-md flex items-center justify-center">
                      <span className="text-gray-400">Document preview</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Completed
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
              
              {signedDocuments.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FileSignature className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No signed documents yet</h3>
                  <p className="text-gray-600">Your signed documents will appear here.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <CardTitle>Contract Template</CardTitle>
                  <CardDescription>Standard service agreement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-24 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-gray-400">Template preview</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-gray-50 border-t border-gray-100">
                  <Badge variant="outline">Template</Badge>
                  <Button variant="outline" size="sm">Use Template</Button>
                </CardFooter>
              </Card>
              
              <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <CardTitle>NDA Template</CardTitle>
                  <CardDescription>Non-disclosure agreement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-24 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-gray-400">Template preview</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-gray-50 border-t border-gray-100">
                  <Badge variant="outline">Template</Badge>
                  <Button variant="outline" size="sm">Use Template</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {sending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Signing Document</CardTitle>
              <CardDescription>Processing your signature...</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="mb-4" />
              <p className="text-sm text-gray-500 text-center">
                {progress < 30 ? "Encrypting signature..." : 
                 progress < 60 ? "Applying to document..." : 
                 progress < 90 ? "Validating signature..." : 
                 "Finalizing document..."}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign Document: {currentDocument?.title}</DialogTitle>
            <DialogDescription>
              Add your signature to complete this document.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Tabs defaultValue="draw" onValueChange={setSignatureMode}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="draw">Draw</TabsTrigger>
                <TabsTrigger value="type">Type</TabsTrigger>
              </TabsList>
              <TabsContent value="draw" className="mt-4">
                <div className="border-2 border-dashed border-gray-300 rounded-md p-1 bg-white">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={150}
                    className="w-full h-[150px] cursor-crosshair touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={clearCanvas}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </TabsContent>
              <TabsContent value="type" className="mt-4">
                <input
                  type="text"
                  placeholder="Type your name"
                  className="w-full p-3 border border-gray-300 rounded-md font-handwriting text-2xl text-blue-600"
                  onChange={typeSignature}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button variant="outline" onClick={() => setShowSignatureDialog(false)}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button 
              onClick={handleSignDocument}
              disabled={!signature}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-1" />
              Sign Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>SignFlow E-Signature Platform © 2023. All rights reserved.</p>
          <p className="mt-1">Secure, legally binding electronic signatures compliant with ESIGN and eIDAS.</p>
        </div>
      </footer>
    </div>
  );
}