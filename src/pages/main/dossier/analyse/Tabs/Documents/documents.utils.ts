// Utility functions for DocumentsSection and related components

import { FileDto } from "@/api-swagger";

// Map French tab labels to FileDto.status values
export const tabStatusMap: Record<string, FileDto.status> = {
  "En étude": FileDto.status.UNDER_STUDY,
  "En attente": FileDto.status.PENDING,
  "En attente *": FileDto.status.PENDING_STAR,
  "À saisir": FileDto.status.TO_BE_ENTERED,
  "À saisir *": FileDto.status.TO_BE_ENTERED_STAR,
  "À payer": FileDto.status.TO_BE_PAID,
  "Attente greffe": FileDto.status.WAITING_FOR_GREFFE,
  "Attente greffe *": FileDto.status.WAITING_FOR_GREFFE_STAR,
  Refusé: FileDto.status.REJECTED,
  Terminé: FileDto.status.COMPLETED,
  Bloqué: FileDto.status.BLOCKED,
};

// Helper to get label from status
export const getLabelFromStatus = (
  status: FileDto.status
): string | undefined =>
  Object.keys(tabStatusMap).find((label) => tabStatusMap[label] === status);

// Helper to get status from label
export const getStatusFromLabel = (label: string): FileDto.status | undefined =>
  tabStatusMap[label];
