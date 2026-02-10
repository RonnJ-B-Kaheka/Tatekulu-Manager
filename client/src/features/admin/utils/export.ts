import Papa from 'papaparse';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

/**
 * Exports data to CSV and triggers sharing/download
 */
export const exportToCSV = async (data: any[], filename: string) => {
    const csv = Papa.unparse(data);

    if (Platform.OS === 'web') {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        return;
    }

    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, csv);
    await Sharing.shareAsync(fileUri);
};

/**
 * Note: PDF Generation usually happens on a per-component basis with @react-pdf/renderer.
 * We will provide a specific Document component for reports.
 */
