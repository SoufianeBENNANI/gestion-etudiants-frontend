import {
    getAllStudents,
} from "../../students/services/studentService";

import {
    getAllPayements,
    getArchivedPayements,
} from "../../payments/services/payementService";

import {
    getAllAttendances,
} from "../../attendance/services/attendanceService";

import {
    getAllGrades,
} from "../../grades/services/gradeService";

import {
    getAllPredictions,
} from "../../predictions/services/predictionService";

import {
    getAllCourses,
} from "../../courses/services/courseService";

import {
    getAllClasses,
} from "../../classes/services/classService";

import {
    getAllTeachers,
} from "../../teachers/services/teacherService";

const safeArray = (data) => {
    return Array.isArray(data) ? data : [];
};

const getValue = (result) => {
    return result.status === "fulfilled"
        ? safeArray(result.value)
        : [];
};

const getStudentClassId = (student) => {
    return (
        student.classeId ||
        student.classId ||
        student.idClasse ||
        student.id_class ||
        student.classe?.id ||
        student.class?.id ||
        null
    );
};

const getClassName = (classe) => {
    return (
        classe?.nom ||
        classe?.name ||
        classe?.libelle ||
        classe?.classeName ||
        classe?.niveau ||
        "-"
    );
};

const attachClassesToStudents = (
    students,
    classes
) => {
    return students.map((student) => {
        const studentClassId =
            getStudentClassId(student);

        const matchedClass =
            classes.find((classe) => {
                return (
                    String(classe.id) ===
                    String(studentClassId)
                );
            });

        return {
            ...student,

            classe:
                matchedClass ||
                student.classe ||
                null,

            classeName:
                matchedClass
                    ? getClassName(matchedClass)
                    : student.classeName || "-",
        };
    });
};

const calculatePaymentStatistics = (
    payements
) => {
    const totalAmount =
        payements.reduce(
            (total, payement) => {
                const amount = Number(
                    payement?.montant ??
                    payement?.amount ??
                    payement?.prix ??
                    0
                );

                return Number.isNaN(amount)
                    ? total
                    : total + amount;
            },
            0
        );

    const paidPayements =
        payements.filter((payement) => {
            const status = String(
                payement?.statut ||
                payement?.status ||
                payement?.etat ||
                ""
            ).toUpperCase();

            return (
                status === "PAID" ||
                status === "PAYE" ||
                status === "PAYÉ" ||
                status === "COMPLETE" ||
                status === "COMPLETED"
            );
        });

    const pendingPayements =
        payements.filter((payement) => {
            const status = String(
                payement?.statut ||
                payement?.status ||
                payement?.etat ||
                ""
            ).toUpperCase();

            return (
                status === "PENDING" ||
                status === "EN_ATTENTE" ||
                status === "IMPAYE" ||
                status === "IMPAYÉ"
            );
        });

    return {
        totalAmount,
        totalPayements: payements.length,
        paidPayements:
            paidPayements.length,
        pendingPayements:
            pendingPayements.length,
    };
};

export const getDashboardData = async () => {
    const [
        studentsResult,
        payementsResult,
        archivedPayementsResult,
        attendancesResult,
        gradesResult,
        predictionsResult,
        coursesResult,
        classesResult,
        teachersResult,
    ] = await Promise.allSettled([
        getAllStudents(),
        getAllPayements(),
        getArchivedPayements(),
        getAllAttendances(),
        getAllGrades(),
        getAllPredictions(),
        getAllCourses(),
        getAllClasses(),
        getAllTeachers(),
    ]);

    const students =
        getValue(studentsResult);

    const payements =
        getValue(payementsResult);

    const classes =
        getValue(classesResult);

    return {
        students:
            attachClassesToStudents(
                students,
                classes
            ),

        archivedStudents: [],

        attendances:
            getValue(attendancesResult),

        grades:
            getValue(gradesResult),

        predictions:
            getValue(predictionsResult),

        courses:
            getValue(coursesResult),

        classes,

        teachers:
            getValue(teachersResult),

        payements,

        archivedPayements:
            getValue(
                archivedPayementsResult
            ),

        paymentStatistics:
            calculatePaymentStatistics(
                payements
            ),

        departements: [],
        models: [],
    };
};

export const getManagerDashboardData =
    getDashboardData;