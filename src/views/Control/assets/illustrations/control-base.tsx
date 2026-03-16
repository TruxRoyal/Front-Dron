export const ControllerDiagram = () => (
  <div className="relative w-full aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 bg-[#04112b] shadow-inner">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.10) 1.3px, transparent 1px)",
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0",
      }}
    />

    <svg
      viewBox="0 0 625 395"
      className="relative z-10 h-full w-full"
      aria-label="Manual visual del mando"
    >
      <g transform="translate(60 34) scale(0.78)">
        {/* Silueta*/}
        <path
          d="M450.5 363.598H174.5L105 390.598L68 394.098L43 387.098L12.5 358.098L0.5 325.098V277.598L21.5 191.098L47 122.098L51 112.598L64 102.098L105 9.09821L140.5 0.598206L154 35.5982L165.5 40.0982L174.5 54.0982H188.5L212 65.0982H412L434 54.0982H454L460.5 40.0982L472 35.5982L485 0.598206L517.5 9.09821L562.5 102.098L576 112.598L580 122.098L603.5 191.098L624 277.598V325.098L614 358.098L580 387.098L540.5 394.098L505.5 387.098L450.5 363.598Z"
          fill="rgba(255,255,255,0.015)"
          stroke="rgba(255,255,255,0.82)"
          strokeWidth="2"
        />

        {/* LEDs */}
        <g>
          <circle cx="312" cy="132" r="4" fill="#86efac" />
          <circle cx="320" cy="128" r="4" fill="#86efac" />
          <circle cx="328" cy="132" r="4" fill="#86efac" />
        </g>

        {/* Stick izquierdo */}
        <g transform="translate(125 180)">
          <circle
            r="38"
            fill="none"
            stroke="rgba(255,255,255,0.82)"
            strokeWidth="2.5"
          />
          <circle
            r="28"
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.88)"
            strokeWidth="2.5"
          />
        </g>

        {/* D-pad */}
        <g transform="translate(220 273)">
          <g transform="scale(1.6)">
            <circle
              r="22"
              fill="rgba(255,255,255,0.03)"
              stroke="rgba(255,255,255,0.72)"
              strokeWidth="1.7"
            />
            <path
              d="M-5,-16 h10 v11 h11 v10 h-11 v11 h-10 v-11 h-11 v-10 h11 z"
              fill="rgba(255,255,255,0.08)"
              stroke="rgba(255,255,255,0.82)"
              strokeWidth="1.6"
            />
          </g>
        </g>

        {/* Botones centrales */}
        <g transform="translate(315 210)">
          {/* Botón izquierdo */}
          <g transform="translate(-18 -37)">
            <circle
              r="15"
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.72)"
              strokeWidth="1.5"
            />
            <rect
              x="-4"
              y="-4"
              width="8"
              height="8"
              rx="1.5"
              fill="none"
              stroke="rgba(255,255,255,0.72)"
              strokeWidth="1.2"
            />
          </g>

          {/* Botón derecho */}
          <g transform="translate(18 -37)">
            <circle
              r="15"
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.72)"
              strokeWidth="1.5"
            />
            <path
              d="M-4 -4 H4 M-4 0 H4 M-4 4 H4"
              stroke="rgba(255,255,255,0.72)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* Stick derecho */}
        <g transform="translate(395 273)">
          <circle
            r="38"
            fill="none"
            stroke="rgba(255,255,255,0.82)"
            strokeWidth="2.5"
          />
          <circle
            r="28"
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.88)"
            strokeWidth="2.5"
          />
        </g>

        {/* Botones A B X Y */}
        <g fontFamily="Inter, Arial, sans-serif" fontWeight="700">
          <circle
            cx="500"
            cy="135"
            r="20"
            fill="rgba(255,255,255,0.04)"
            stroke="rgb(253, 224, 71)"
            strokeWidth="1.5"
          />
          <circle
            cx="540"
            cy="165"
            r="20"
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(239,68,68,0.9)"
            strokeWidth="1.8"
          />
          <circle
            cx="500"
            cy="200"
            r="20"
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(34,197,94,0.95)"
            strokeWidth="1.8"
          />
          <circle
            cx="458"
            cy="165"
            r="20"
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(96,165,250,0.9)"
            strokeWidth="1.5"
          />

          <text x="500" y="140" textAnchor="middle" fontSize="16" fill="#fde047">
            Y
          </text>
          <text x="540" y="169" textAnchor="middle" fontSize="16" fill="#ef4444">
            B
          </text>
          <text x="500" y="206" textAnchor="middle" fontSize="16" fill="#22c55e">
            A
          </text>
          <text x="458" y="169" textAnchor="middle" fontSize="16" fill="#60a5fa">
            X
          </text>
        </g>
      </g>

      {/* Etiquetas fuera del grupo escalado */}

      <g
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="700"
        fontSize="11"
        letterSpacing="0.4"
        fill="#e5e7eb"
      >
        {/* Aterrizar - botón X */}
        <path
          d="M95 118 L418 118 L418 152"
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="20" y="125" fill="#93c5fd">
          ATERRIZAR
        </text>

        {/* Altitud / giro - stick izquierdo */}
        <path
          d="M157 222 L157 280 L110 280"
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2"
        />
        <text x="18" y="275">ALTITUD / GIRO</text>
        <text x="18" y="289" fill="#4ade80">
          STICK IZQ
        </text>

        {/* Despegar - botón Y */}
        <path
          d="M450 135 L450 92 L535 92"
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2"
        />
        <text x="548" y="96" fill="#fde047">
          DESPEGAR
        </text>

        {/* Grabar video - botón B */}
        <path
          d="M482 163 L545 163"
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2"
        />
        <text x="560" y="167" fill="#ef4444">
          GRABAR
        </text>

        {/* Capturar foto - botón A */}
        <path
          d="M450 190 L545 190"
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2"
        />
        <text x="560" y="194" fill="#22c55e">
          FOTO
        </text>

        {/* Movimiento - stick derecho */}
        <path
          d="M368 245 L368 290 L525 290"
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2"
        />
        <text x="540" y="276">MOVIMIENTO</text>
        <text x="540" y="290" fill="#4ade80">
          STICK DER
        </text>
      </g>

    </svg>
  </div>
);