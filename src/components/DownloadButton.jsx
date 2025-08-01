import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { track } from '@vercel/analytics';

const DownloadButton = ({ content, videoUrl, language }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const getVideoInfo = (url) => {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v") || urlObj.pathname.split("/").pop();
      
      // Extract potential title from URL parameters or create a clean name
      const urlParams = new URLSearchParams(urlObj.search);
      const title = urlParams.get("title") || "";
      
      return {
        videoId: videoId || "unknown",
        cleanTitle: title ? title.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 50) : null
      };
    } catch {
      return {
        videoId: "unknown",
        cleanTitle: null
      };
    }
  };

  const generateFileName = (videoUrl, language, content) => {
    const { videoId, cleanTitle } = getVideoInfo(videoUrl);
    
    // Extract title from content (first line that's not too long)
    const contentTitle = content
      .split('\n')
      .find(line => line.trim() && line.length > 10 && line.length < 80)
      ?.replace(/[#*`]/g, '')
      .trim()
      .substring(0, 40);
    
    // Create a meaningful filename
    const title = cleanTitle || contentTitle || "Learning_Notes";
    const cleanFileName = title
      .replace(/[^a-zA-Z0-9\s\u0980-\u09FF]/g, '') // Allow Bengali characters
      .replace(/\s+/g, '_')
      .substring(0, 50);
    
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const langCode = language === 'Bengali' ? 'BN' : 'EN';
    
    return `${cleanFileName}_${langCode}_${timestamp}_NoteQuik.pdf`;
  };

  const generatePDF = async () => {
    if (!content) return;

    setIsGenerating(true);

    // Track PDF download attempt
    track('PDF Download Started', {
      videoUrl: videoUrl,
      language: language,
      contentLength: content.length,
      timestamp: new Date().toISOString()
    });

    try {
      const fileName = generateFileName(videoUrl, language, content);
      const htmlContent = convertMarkdownToHTML(content);
      
      // Create a temporary DOM element with the styled content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '794px'; // A4 width in pixels at 96 DPI
      tempDiv.style.fontFamily = language === 'Bengali' ? "'Noto Sans Bengali', 'SolaimanLipi', 'Kalpurush', sans-serif" : "'Noto Sans', 'Arial', sans-serif";
      tempDiv.style.fontSize = '14px';
      tempDiv.style.lineHeight = '1.7';
      tempDiv.style.color = '#2d3748';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '40px';
      
      tempDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 40px; padding-bottom: 25px; border-bottom: 4px solid #7affa1;">
          <h1 style="font-size: 36px; font-weight: 700; margin: 0 0 15px 0; color: #1a365d; letter-spacing: -1px;">NoteQuik</h1>
          <div style="font-size: 18px; color: #4a5568; margin: 10px 0; font-weight: 500;">AI-Generated Learning Notes</div>
          <div style="font-size: 12px; color: #718096; background: #f7fafc; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-top: 10px; border: 1px solid #e2e8f0;">
            Language: ${language} • Generated: ${new Date().toLocaleDateString()} • notequik.com
          </div>
        </div>
        
        <div style="font-size: 14px; line-height: 1.8; color: #2d3748;">
          ${htmlContent}
        </div>
        
        <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; font-size: 11px; color: #a0aec0;">
          <p style="margin: 5px 0; line-height: 1.5;"><strong>Generated by NoteQuik</strong></p>
          <p style="margin: 5px 0; line-height: 1.5;">Transform YouTube videos into comprehensive learning notes • notequik.com</p>
        </div>
      `;
      
      // Add the element to the DOM temporarily
      document.body.appendChild(tempDiv);
      
      // Wait for fonts to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate canvas from the HTML content
      const canvas = await html2canvas(tempDiv, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: tempDiv.scrollHeight + 80, // Add some padding
        logging: false
      });
      
      // Remove the temporary element
      document.body.removeChild(tempDiv);
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 10; // 10mm top margin
      
      // Add image to PDF, splitting into multiple pages if needed
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight - 20; // Subtract margins
      
      // Add additional pages if content is too long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10; // 10mm margin
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight - 20;
      }
      
      // Download the PDF
      pdf.save(fileName);

      // Track successful PDF download
      track('PDF Downloaded Successfully', {
        fileName: fileName,
        videoUrl: videoUrl,
        language: language,
        contentLength: content.length,
        pdfPages: pdf.internal.getNumberOfPages(),
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("Error generating PDF:", error);
      
      // Track PDF download failure
      track('PDF Download Failed', {
        videoUrl: videoUrl,
        language: language,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const convertMarkdownToHTML = (markdown) => {
    let html = markdown;
    
    // Headers with better spacing and styling
    html = html.replace(/^# (.*$)/gim, '<h1 style="color: #1a365d; font-size: 32px; font-weight: 700; margin: 35px 0 25px 0; border-bottom: 3px solid #7affa1; padding-bottom: 15px; line-height: 1.3;">$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2 style="color: #2d5c8f; font-size: 24px; font-weight: 600; margin: 30px 0 18px 0; border-left: 5px solid #fff87c; padding-left: 20px; line-height: 1.4;">$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3 style="color: #4a5568; font-size: 20px; font-weight: 600; margin: 25px 0 15px 0; color: #2d3748;">$1</h3>');
    html = html.replace(/^#### (.*$)/gim, '<h4 style="color: #4a5568; font-size: 18px; font-weight: 500; margin: 20px 0 12px 0;">$1</h4>');
    
    // Bold text with better styling
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #1a365d; font-weight: 700;">$1</strong>');
    
    // Italic text
    html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em style="color: #4a5568; font-style: italic;">$1</em>');
    
    // Inline code with better styling
    html = html.replace(/`(.*?)`/g, '<code style="background-color: #f7fafc; color: #1a365d; padding: 4px 8px; border-radius: 4px; font-family: \'Consolas\', \'Monaco\', \'Courier New\', monospace; border: 1px solid #e2e8f0; font-size: 14px;">$1</code>');
    
    // Convert bullet points to proper lists
    const lines = html.split('\n');
    let processedLines = [];
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.match(/^[\*\-\+] /)) {
        if (!inList) {
          processedLines.push('<ul style="margin: 20px 0; padding-left: 35px; list-style-type: none;">');
          inList = true;
        }
        const listItem = line.replace(/^[\*\-\+] /, '');
        processedLines.push(`<li style="margin: 12px 0; line-height: 1.8; position: relative;"><span style="position: absolute; left: -20px; color: #7affa1; font-weight: bold;">•</span>${listItem}</li>`);
      } else {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        if (line) {
          processedLines.push(line);
        }
      }
    }
    
    if (inList) {
      processedLines.push('</ul>');
    }
    
    html = processedLines.join('\n');
    
    // Convert line breaks to paragraphs with better spacing
    html = html.replace(/\n\n+/g, '</p><p style="margin: 18px 0; line-height: 1.9; text-align: justify; color: #2d3748;">');
    
    // Wrap content in paragraph tags
    if (!html.startsWith('<h1') && !html.startsWith('<h2') && !html.startsWith('<ul')) {
      html = '<p style="margin: 18px 0; line-height: 1.9; text-align: justify; color: #2d3748;">' + html + '</p>';
    }
    
    return html;
  };

  if (!content) return null;

  return (
    <div className="flex justify-center mt-6">
      <Button
        onClick={generatePDF}
        disabled={isGenerating}
        variant="gradient"
        size="lg"
        className="font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="mr-2 h-5 w-5" />
            Download as PDF
          </>
        )}
      </Button>
    </div>
  );
};

export default DownloadButton;
