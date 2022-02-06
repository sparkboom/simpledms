import mongoClient from "../clients/mongo.ts";
import { publisAmqpConn } from '../clients/amqp.ts';
import fileClient from '../clients/file.ts';

// Types
type Status = 'ok' | 'fail';
interface CheckStatus {
  status: Status;
  details?: {
    clientStatus?: string;
    errorDetails?: any;
  }
}

// Implementation
export const mongoCheck = (): CheckStatus => {
  const success = mongoClient.status === 'CONNECTED' || mongoClient.status === 'CONNECTING';
  return {
    status: success ? 'ok' : 'fail',
    details: {
      clientStatus: mongoClient.status,
      errorDetails: mongoClient.errorDetails,
    }
  };
};

export const amqpCheck = () => {

  const success = publisAmqpConn.status === 'CONNECTED' || publisAmqpConn.status === 'CONNECTING';
  return {
    status: success? 'ok': 'fail',
    details: {
      clientStatus: publisAmqpConn.status,
      errorDetails: publisAmqpConn.errorDetails,
    }
  };
};

export const fileCheck = () => {
  const report = fileClient.checkAccess();
  return {
    status: report.status,
    details: report.data || { error: report.error },
  };
};

export const getStatusReport = () => {
  const checks = {
    mongodb: mongoCheck(),
    aqmp: amqpCheck(),
    file: fileCheck(),
  };
  const allOk = Object
    .entries(checks)
    .reduce((acc,[,v]) => v.status === 'ok' && acc,true);

  return {
    status: allOk? 'ok' : 'fail',
    checks,
  };
};

export const shutdown = async () => {
  return Promise.all([
    publisAmqpConn.close(),
    mongoClient.close(),
  ]);
};
