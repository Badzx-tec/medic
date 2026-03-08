import * as Dialog from '@radix-ui/react-dialog';
import { Loader2, Pencil, Trash2, Upload, X } from 'lucide-react';
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';

type MediaAssetFieldProps = {
  label: string;
  description: string;
  value: string;
  aspectRatio: number;
  outputWidth: number;
  outputHeight: number;
  onChange: (value: string) => void;
  onUpload: (dataUrl: string) => Promise<void>;
};

type CropState = {
  zoom: number;
  offsetX: number;
  offsetY: number;
};

const defaultCropState: CropState = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0
};

export function MediaAssetField(props: MediaAssetFieldProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sourceDataUrl, setSourceDataUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: props.outputWidth, height: props.outputHeight });
  const [crop, setCrop] = useState<CropState>(defaultCropState);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (sourceDataUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(sourceDataUrl);
      }
    };
  }, [sourceDataUrl]);

  const previewStyle = useMemo(
    () => ({
      width: `${crop.zoom * 100}%`,
      height: `${crop.zoom * 100}%`,
      left: `calc(50% + ${crop.offsetX * 0.6}px)`,
      top: `calc(50% + ${crop.offsetY * 0.6}px)`
    }),
    [crop]
  );

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const image = await loadImage(objectUrl);
    setNaturalSize({ width: image.naturalWidth, height: image.naturalHeight });
    setCrop(defaultCropState);
    setSourceDataUrl(objectUrl);
    setDialogOpen(true);
    event.target.value = '';
  };

  const handleSaveCrop = async () => {
    if (!sourceDataUrl) return;

    setIsUploading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = props.outputWidth;
      canvas.height = props.outputHeight;

      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas indisponível no navegador.');

      const image = await loadImage(sourceDataUrl);
      const baseScale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
      const width = image.naturalWidth * baseScale * crop.zoom;
      const height = image.naturalHeight * baseScale * crop.zoom;
      const maxOffsetX = Math.max(0, (width - canvas.width) / 2);
      const maxOffsetY = Math.max(0, (height - canvas.height) / 2);
      const normalizedOffsetX = (crop.offsetX / 100) * maxOffsetX;
      const normalizedOffsetY = (crop.offsetY / 100) * maxOffsetY;

      context.fillStyle = '#f4f7fa';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        image,
        (canvas.width - width) / 2 - normalizedOffsetX,
        (canvas.height - height) / 2 - normalizedOffsetY,
        width,
        height
      );

      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      await props.onUpload(dataUrl);
      setDialogOpen(false);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-50">{props.label}</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">{props.description}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300">
          {props.outputWidth}×{props.outputHeight}
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-[24px] border border-white/10 bg-[#08111c]">
        <div className="relative w-full" style={{ aspectRatio: `${props.aspectRatio}` }}>
          {props.value ? (
            <img src={props.value} alt={props.label} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,#17324c,transparent_58%)] text-sm text-slate-500">
              Sem imagem enviada
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-white"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          Enviar imagem
        </button>
        {props.value && (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.06]"
            onClick={() => fileInputRef.current?.click()}
          >
            <Pencil className="h-4 w-4" />
            Substituir
          </button>
        )}
        {props.value && (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-500/20"
            onClick={() => props.onChange('')}
          >
            <Trash2 className="h-4 w-4" />
            Remover
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={onFileChange}
      />

      <label className="mt-4 block">
        <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">URL manual</span>
        <input
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-[#09121d] px-4 py-3 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
          placeholder="https://..."
        />
      </label>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-[#02060bcc] backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(920px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 rounded-[32px] border border-white/10 bg-[#07111b] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-xl font-semibold text-slate-50">Ajustar recorte</Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-slate-400">
                  Ajuste enquadramento e zoom antes de aplicar a imagem em {props.label.toLowerCase()}.
                </Dialog.Description>
              </div>
              <Dialog.Close className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08]">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr),280px]">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#09121d] p-4">
                <div className="relative mx-auto overflow-hidden rounded-[24px] bg-slate-950/70" style={{ aspectRatio: `${props.aspectRatio}` }}>
                  {sourceDataUrl && (
                    <img
                      src={sourceDataUrl}
                      alt="Prévia do recorte"
                      className="absolute max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
                      style={previewStyle}
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 border border-white/10" />
                </div>
              </div>

              <div className="space-y-5 rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
                <SliderField
                  label="Zoom"
                  min={1}
                  max={2.4}
                  step={0.01}
                  value={crop.zoom}
                  onChange={(value) => setCrop((current) => ({ ...current, zoom: value }))}
                />
                <SliderField
                  label="Deslocamento horizontal"
                  min={-100}
                  max={100}
                  step={1}
                  value={crop.offsetX}
                  onChange={(value) => setCrop((current) => ({ ...current, offsetX: value }))}
                />
                <SliderField
                  label="Deslocamento vertical"
                  min={-100}
                  max={100}
                  step={1}
                  value={crop.offsetY}
                  onChange={(value) => setCrop((current) => ({ ...current, offsetY: value }))}
                />

                <div className="rounded-2xl border border-white/10 bg-[#09121d] p-4 text-xs leading-6 text-slate-400">
                  <p>Base carregada: {naturalSize.width}×{naturalSize.height}px</p>
                  <p>Saída final: {props.outputWidth}×{props.outputHeight}px</p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/[0.06]"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleSaveCrop}
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Aplicar imagem'}
                  </button>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function SliderField(props: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
        <span>{props.label}</span>
        <span>{props.value.toFixed(props.step < 1 ? 2 : 0)}</span>
      </div>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(event) => props.onChange(Number(event.target.value))}
        className="w-full accent-cyan-300"
      />
    </label>
  );
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Não foi possível carregar a imagem selecionada.'));
    image.src = src;
  });
}
