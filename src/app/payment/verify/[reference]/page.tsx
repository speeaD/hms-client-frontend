// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useParams } from "next/navigation";
// import styles from "./page.module.css";

// // Adjust these to match how your Express routes are mounted.
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
// const VERIFY_PATH = (reference: string) => `${API_BASE_URL}/api/reservations/verify-payment/${reference}`;
// const RESERVATION_PATH = (id: string) => `${API_BASE_URL}/api/reservations/${id}`;

// type VerifyState = "loading" | "success" | "declined" | "error";

// interface PaymentData {
//     status: string;
//     amount?: number;
//     paidAt?: string;
//     reservationId?: string;
// }

// interface VerifyResponse {
//     success: boolean;
//     message?: string;
//     data?: PaymentData;
// }

// interface Room {
//     id: string;
//     roomNumber: string;
// }

// interface Reservation {
//     id: string;
//     firstName?: string;
//     lastName?: string;
//     checkInDate: string;
//     checkOutDate: string;
//     room?: Room;
// }

// function formatDate(value?: string | null): string {
//     if (!value) return "—";
//     return new Date(value).toLocaleDateString(undefined, {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//     });
// }

// function formatDateTime(value?: string | null): string {
//     if (!value) return "—";
//     return new Date(value).toLocaleString(undefined, {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         hour: "numeric",
//         minute: "2-digit",
//     });
// }

// function formatAmount(amount?: number | null): string {
//     if (amount === undefined || amount === null) return "—";
//     return new Intl.NumberFormat(undefined, { style: "currency", currency: "NGN" }).format(amount);
// }

// export default function PaymentVerifyPage() {
//     const params = useParams<{ reference: string }>();
//     const reference = params?.reference;

//     const [state, setState] = useState<VerifyState>("loading");
//     const [payment, setPayment] = useState<PaymentData | null>(null);
//     const [reservation, setReservation] = useState<Reservation | null>(null);
//     const [errorMessage, setErrorMessage] = useState<string>("");

//     const runVerification = useCallback(async (ref: string) => {
//         setState("loading");
//         setErrorMessage("");

//         try {
//             const res = await fetch(VERIFY_PATH(ref), { method: "GET" });
//             const body: VerifyResponse = await res.json();

//             if (res.ok && body.success) {
//                 setPayment(body.data ?? null);

//                 if (body.data?.reservationId) {
//                     try {
//                         const resvRes = await fetch(RESERVATION_PATH(body.data.reservationId));
//                         if (resvRes.ok) {
//                             const resvBody: Reservation = await resvRes.json();
//                             setReservation(resvBody);
//                         }
//                     } catch {
//                         // Reservation detail fetch is a nice-to-have; payment status still stands.
//                     }
//                 }

//                 setState("success");
//                 return;
//             }

//             if (res.status === 400) {
//                 setPayment(body.data ?? null);
//                 setState("declined");
//                 return;
//             }

//             setErrorMessage(body.message || "We couldn't confirm this payment.");
//             setState("error");
//         } catch (err) {
//             setErrorMessage(err instanceof Error ? err.message : "Something went wrong while confirming your payment.");
//             setState("error");
//         }
//     }, []);

//     useEffect(() => {
//         if (reference) runVerification();
//     }, [reference, runVerification]);

//     return (
//         <main className={styles.page}>
//             <div className={styles.folio}>
//                 <div className={styles.folioHead}>
//                     <span className={styles.eyebrow}>Guest folio</span>
//                     <span className={styles.refCode}>{reference}</span>
//                 </div>

//                 {state === "loading" && (
//                     <div className={styles.statusBlock}>
//                         <div className={styles.spinner} aria-hidden="true" />
//                         <h1 className={styles.headline}>Confirming your payment</h1>
//                         <p className={styles.subcopy}>This only takes a moment. Don&apos;t close this page.</p>
//                     </div>
//                 )}

//                 {state === "success" && (
//                     <div className={styles.statusBlock}>
//                         <div className={`${styles.stamp} ${styles.stampPaid}`} aria-hidden="true">
//                             <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
//                                 <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
//                             </svg>
//                             <span>Paid</span>
//                         </div>
//                         <h1 className={styles.headline}>Payment confirmed</h1>
//                         <p className={styles.subcopy}>Your room is booked and waiting for you.</p>
//                     </div>
//                 )}

//                 {state === "declined" && (
//                     <div className={styles.statusBlock}>
//                         <div className={`${styles.stamp} ${styles.stampDeclined}`} aria-hidden="true">
//                             <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
//                                 <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
//                             </svg>
//                             <span>Declined</span>
//                         </div>
//                         <h1 className={styles.headline}>Payment didn&apos;t go through</h1>
//                         <p className={styles.subcopy}>Your card wasn&apos;t charged. You can try again or use a different card.</p>
//                     </div>
//                 )}

//                 {state === "error" && (
//                     <div className={styles.statusBlock}>
//                         <h1 className={styles.headline}>We couldn&apos;t confirm this payment</h1>
//                         <p className={styles.subcopy}>
//                             {errorMessage} If money left your account, it will be reconciled automatically — you don&apos;t need to pay again.
//                         </p>
//                     </div>
//                 )}

//                 {(state === "success" || state === "declined") && (
//                     <>
//                         <div className={styles.perforation} aria-hidden="true" />

//                         <section className={styles.section}>
//                             <h2 className={styles.sectionLabel}>Payment</h2>
//                             <dl className={styles.factList}>
//                                 <div className={styles.fact}>
//                                     <dt>Amount</dt>
//                                     <dd className={styles.mono}>{formatAmount(payment?.amount)}</dd>
//                                 </div>
//                                 <div className={styles.fact}>
//                                     <dt>Reference</dt>
//                                     <dd className={styles.mono}>{reference}</dd>
//                                 </div>
//                                 {state === "success" && (
//                                     <div className={styles.fact}>
//                                         <dt>Paid at</dt>
//                                         <dd className={styles.mono}>{formatDateTime(payment?.paidAt)}</dd>
//                                     </div>
//                                 )}
//                             </dl>
//                         </section>

//                         {reservation && (
//                             <>
//                                 <div className={styles.perforation} aria-hidden="true" />
//                                 <section className={styles.section}>
//                                     <h2 className={styles.sectionLabel}>Reservation</h2>
//                                     <dl className={styles.factList}>
//                                         <div className={styles.fact}>
//                                             <dt>Guest</dt>
//                                             <dd>{[reservation.firstName, reservation.lastName].filter(Boolean).join(" ") || "—"}</dd>
//                                         </div>
//                                         <div className={styles.fact}>
//                                             <dt>Room</dt>
//                                             <dd>{reservation.room?.roomNumber || "—"}</dd>
//                                         </div>
//                                         <div className={styles.fact}>
//                                             <dt>Check-in</dt>
//                                             <dd className={styles.mono}>{formatDate(reservation.checkInDate)}</dd>
//                                         </div>
//                                         <div className={styles.fact}>
//                                             <dt>Check-out</dt>
//                                             <dd className={styles.mono}>{formatDate(reservation.checkOutDate)}</dd>
//                                         </div>
//                                     </dl>
//                                 </section>
//                             </>
//                         )}
//                     </>
//                 )}

//                 <div className={styles.actions}>
//                     {state === "success" && reservation && (
//                         <a className={styles.primaryButton} href={`/reservations/${reservation.id}`}>
//                             View reservation
//                         </a>
//                     )}
//                     {state === "success" && (
//                         <button className={styles.secondaryButton} onClick={() => window.print()}>
//                             Print receipt
//                         </button>
//                     )}
//                     {state === "declined" && (
//                         <a className={styles.primaryButton} href="/book">
//                             Try again
//                         </a>
//                     )}
//                     {(state === "declined" || state === "error") && (
//                         <a className={styles.secondaryButton} href="mailto:frontdesk@yourhotel.com">
//                             Contact support
//                         </a>
//                     )}
//                     {state === "error" && (
//                         <button className={styles.secondaryButton} onClick={runVerification}>
//                             Retry
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </main>
//     );
// }