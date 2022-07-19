interface recognizerCallbak {
  onstart: () => void;
  onstop: () => void;
  onresult: (text: string) => void;
  onerror: (errMsg: string) => void;
}
