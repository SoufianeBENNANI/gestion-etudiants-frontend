import { getAllStudents } from "../../students/services/studentService";
import { getAllTeachers } from "../../teacher/services/teacherService";

import {
  getAllPayements,
  getArchivedPayements,
  getPayementById,
  addPayement,
  updatePayement,
  deletePayement,
  restorePayement,
  downloadPayementsPdf,
} from "../../payments/services/payementService";

const safeArray = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.data?.content)) {
    return data.data.content;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  return [];
};

const getValue = (result, resourceName) => {
  if (result.status === "fulfilled") {
    return safeArray(result.value);
  }

  console.error(
    `Erreur lors du chargement ${resourceName} :`,
    result.reason
  );

  return [];
};

const getPaymentStatus = (payement) => {
  return String(
    payement?.statut ??
      payement?.status ??
      payement?.etat ??
      ""
  )
    .trim()
    .toUpperCase();
};

const getPaymentAmount = (payement) => {
  const amount = Number(
    payement?.montant ??
      payement?.amount ??
      payement?.prix ??
      0
  );

  return Number.isFinite(amount) ? amount : 0;
};

const isPaidPayment = (payement) => {
  const paidStatuses = [
    "PAID",
    "PAYE",
    "PAYÉ",
    "COMPLETE",
    "COMPLETED",
  ];

  return paidStatuses.includes(getPaymentStatus(payement));
};

const isPendingPayment = (payement) => {
  const pendingStatuses = [
    "PENDING",
    "EN_ATTENTE",
    "EN ATTENTE",
    "IMPAYE",
    "IMPAYÉ",
    "UNPAID",
  ];

  return pendingStatuses.includes(getPaymentStatus(payement));
};

const calculatePaymentStatistics = (payements) => {
  const paidPayements = payements.filter(isPaidPayment);
  const pendingPayements = payements.filter(isPendingPayment);

  const totalAmount = payements.reduce(
    (total, payement) => total + getPaymentAmount(payement),
    0
  );

  const paidAmount = paidPayements.reduce(
    (total, payement) => total + getPaymentAmount(payement),
    0
  );

  const pendingAmount = pendingPayements.reduce(
    (total, payement) => total + getPaymentAmount(payement),
    0
  );

  return {
    totalAmount,
    totalPayements: payements.length,
    paidPayements: paidPayements.length,
    pendingPayements: pendingPayements.length,
    paidAmount,
    pendingAmount,
  };
};

const calculateManagerStatistics = ({
  students,
  teachers,
  payements,
  archivedPayements,
}) => {
  return {
    totalStudents: students.length,
    totalTeachers: teachers.length,
    totalPayements: payements.length,
    totalArchivedPayements: archivedPayements.length,
  };
};

const emptyDashboardData = {
  students: [],
  teachers: [],
  payements: [],
  archivedPayements: [],
  archivedStudents: [],
  archivedTeachers: [],
  paymentStatistics: {
    totalAmount: 0,
    totalPayements: 0,
    paidPayements: 0,
    pendingPayements: 0,
    paidAmount: 0,
    pendingAmount: 0,
  },
  managerStatistics: {
    totalStudents: 0,
    totalTeachers: 0,
    totalPayements: 0,
    totalArchivedPayements: 0,
  },
};

export const getManagerDashboardData = async () => {
  try {
    const [
      studentsResult,
      teachersResult,
      payementsResult,
      archivedPayementsResult,
    ] = await Promise.allSettled([
      getAllStudents(),
      getAllTeachers(),
      getAllPayements(),
      getArchivedPayements(),
    ]);

    const students = getValue(studentsResult, "des étudiants");
    const teachers = getValue(teachersResult, "des enseignants");
    const payements = getValue(payementsResult, "des paiements");
    const archivedPayements = getValue(
      archivedPayementsResult,
      "des paiements archivés"
    );

    return {
      students,
      teachers,
      payements,
      archivedPayements,
      archivedStudents: [],
      archivedTeachers: [],
      paymentStatistics: calculatePaymentStatistics(payements),
      managerStatistics: calculateManagerStatistics({
        students,
        teachers,
        payements,
        archivedPayements,
      }),
    };
  } catch (error) {
    console.error("Manager dashboard service error:", error);
    return emptyDashboardData;
  }
};

export const getManagerPayementById = async (id) => {
  return getPayementById(id);
};

export const addManagerPayement = async (payementDTO) => {
  return addPayement(payementDTO);
};

export const updateManagerPayement = async (id, payementDTO) => {
  return updatePayement(id, payementDTO);
};

export const deleteManagerPayement = async (id) => {
  return deletePayement(id);
};

export const restoreManagerPayement = async (id) => {
  return restorePayement(id);
};

export const downloadManagerPayementsPdf = async () => {
  return downloadPayementsPdf();
};

export const getDashboardData = getManagerDashboardData;

export default getManagerDashboardData;