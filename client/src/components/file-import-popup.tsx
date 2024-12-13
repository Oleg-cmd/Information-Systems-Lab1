import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface FileImportPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
}

export function FileImportPopupComponent({
  isOpen,
  onClose,
  onImport,
}: FileImportPopupProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/json") {
        setFile(selectedFile);
        setError(null);
      } else {
        setFile(null);
        setError("Please select a JSON file.");
      }
    }
  };

  const handleImport = () => {
    if (file) {
      onImport(file);
      onClose();
    } else {
      setError("Please select a file to import.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Импорт Продуктов</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label
              htmlFor='file-upload'
              className='text-left col-span-4'
            >
              Выберите JSON файл для импорта:
            </Label>
            <Input
              id='file-upload'
              type='file'
              accept='.json'
              onChange={handleFileChange}
              className='col-span-4'
            />
          </div>
          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button
            type='button'
            variant='secondary'
            onClick={onClose}
          >
            Отмена
          </Button>
          <Button
            type='button'
            onClick={handleImport}
            disabled={!file}
          >
            <Upload className='mr-2 h-4 w-4' /> Импорт
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
