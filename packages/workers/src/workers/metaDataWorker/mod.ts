import { PDFDocument } from 'pdf-lib';
import { DocumentSchema } from 'common/src/mongodb/models/document.ts';

// TODO: Consider using Apache Tika for future - https://tika.apache.org/1.26/gettingstarted.html

const getMetaData = async (contentType: string, content: Uint8Array) => {
  if (contentType === 'application/pdf') {
    // Load a PDFDocument without updating its existing metadata
    const pdfDoc = await PDFDocument.load(content, {
      updateMetadata: false,
    });
    return {
      pdf: {
        title: pdfDoc.getTitle(),
        author: pdfDoc.getAuthor(),
        subject: pdfDoc.getSubject(),
        creator: pdfDoc.getCreator(),
        keywords: pdfDoc.getKeywords(),
        creationDate: pdfDoc.getCreationDate(),
        modificationDate: pdfDoc.getModificationDate(),
      }
    };
  }
  return {};
};

const run = async (args: any, props: any, doc: DocumentSchema): Promise<boolean> => {
  console.log(`Meta Data Worker: ${args.queueName}#${args.deliveryTag} Document #${doc._id} received.`);
  return false;
};

export default {
  name: 'Meta Data Extractor',
  key: 'simpledms.metaDataExtractor',
  version: '1.0.0',
  description: 'The Meta Data Extractor will read the document content, and extract any useful meta data that could be used for indexing.',
  run,
};
