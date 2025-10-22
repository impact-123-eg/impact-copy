// components/free-test/AudioPlayer.jsx (UPDATED)
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const AudioPlayer = ({ src, className = "" }) => {
  const { t } = useTranslation();

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) {
      setError(t("freeTest.audio.noAudioAvailable"));
      setIsLoading(false);
      return;
    }

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleLoadedData = () => {
      setIsLoading(false);
      setAudioDuration(audio.duration);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = (e) => {
      setError(t("freeTest.audio.audioError"));
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    // Set audio source and load
    audio.src = src;
    audio.load();

    // Add event listeners
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("loadeddata", handleLoadedData);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      // Cleanup
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("loadeddata", handleLoadedData);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);

      // Reset audio
      audio.pause();
      audio.src = "";
    };
  }, [src, t]);

  const togglePlay = async () => {
    if (!audioRef.current || error) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      setError("Failed to play audio");
    }
  };

  const handleReplay = async () => {
    if (!audioRef.current) return;

    try {
      audioRef.current.currentTime = 0;
      setProgress(0);
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      setError("Failed to replay audio");
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!src) {
    return (
      <div
        className={`bg-gray-50 border border-gray-200 rounded-xl p-4 text-center ${className}`}
      >
        <p className="text-gray-500 text-sm">
          {t("freeTest.audio.noAudioAvailable")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-xl p-4 text-center ${className}`}
      >
        <div className="flex items-center justify-center space-x-2 mb-2">
          <svg
            className="w-5 h-5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
        <button
          onClick={handleReplay}
          className="text-red-600 hover:text-red-800 text-sm underline"
        >
          {t("freeTest.audio.tryAgain")}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-50 border border-gray-200 rounded-xl p-4 ${className}`}
    >
      <audio
        ref={audioRef}
        preload="auto"
        className="hidden"
        crossOrigin="anonymous"
      >
        <source src={src} type="audio/mpeg" />
        {t("freeTest.audio.audioNotSupported")}
      </audio>

      <div className="flex items-center justify-between space-x-4 rtl:space-x-reverse">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="flex-shrink-0 w-12 h-12 bg-[var(--Yellow)] text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Progress Bar and Time */}
        <div className="flex-1 space-y-1">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[var(--Yellow)] h-2 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
            <span>{formatTime(audioDuration)}</span>
          </div>
        </div>

        {/* Replay Button */}
        <button
          onClick={handleReplay}
          disabled={isLoading}
          className="flex-shrink-0 w-10 h-10 text-[var(--SubText)] hover:text-[var(--Main)] transition-colors disabled:opacity-50"
          title={t("freeTest.audio.replayAudio")}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Status Text */}
      <div className="text-center mt-2">
        <p className="text-sm text-[var(--SubText)]">
          {isLoading
            ? t("freeTest.audio.audioLoading")
            : isPlaying
            ? t("freeTest.audio.playingAudio")
            : t("freeTest.audio.playAudio")}
        </p>
      </div>
    </div>
  );
};

export default AudioPlayer;
