import Tesseract from 'tesseract.js';

export interface ExtractedExpense {
  amount: number;
  description: string;
  date: string;
  merchant?: string;
}

export const extractTextFromImage = async (imageFile: File): Promise<string> => {
  try {
    const { data: { text } } = await Tesseract.recognize(imageFile, 'eng', {
      logger: m => console.log(m)
    });
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
};

export const parseReceiptText = (text: string): ExtractedExpense | null => {
  try {
    // Simple receipt parsing logic
    const lines = text.split('\n').filter(line => line.trim());
    
    // Look for amount patterns (₹XXX.XX or XXX.XX)
    const amountRegex = /₹?\s*(\d+(?:,\d+)*(?:\.\d{2})?)/g;
    const amounts = text.match(amountRegex);
    
    // Look for date patterns
    const dateRegex = /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})|(\d{1,2}\s+\w+\s+\d{2,4})/g;
    const dates = text.match(dateRegex);
    
    // Extract merchant name (usually in first few lines)
    const merchant = lines.slice(0, 3).find(line => 
      line.length > 3 && line.length < 50 && !/\d/.test(line)
    );

    if (amounts && amounts.length > 0) {
      // Get the largest amount (likely the total)
      const amount = Math.max(...amounts.map(a => 
        parseFloat(a.replace(/₹|,/g, ''))
      ));

      return {
        amount,
        description: merchant || 'Receipt scan',
        date: dates?.[0] ? new Date(dates[0]).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        merchant: merchant || undefined
      };
    }

    return null;
  } catch (error) {
    console.error('Receipt parsing error:', error);
    return null;
  }
};