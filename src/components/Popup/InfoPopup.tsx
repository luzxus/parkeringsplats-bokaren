import './InfoPopup.css'

const InfoPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="modal">
    <div className="modal-content">
      <h2 className="modal-title">Parkeringsplats Information</h2>
      <span className="close" onClick={onClose}>
        &times;
      </span>
      <div className="info-section">
        <h3>San Francisco</h3>
        <p>
          San Francisco är parkeringsplatsen som är nedanför kontoret på
          parkeringsplats 14.
        </p>
      </div>
      <div className="info-section">
        <h3>Boston</h3>
        <p>
          Boston parkeringarna är i garaget.
          <br />
          <span className="note">
            Notera att boston-parkeringarna kräver att man parkerar framför
            varandra så den som är innerst (Boston 2) behöver vänta på att
            Boston 1 är ute.
          </span>
        </p>
      </div>
      <div className="info-section">
        <h3>Övrigt</h3>
        <p>
            Tänk på att parkeringskorten alltid behöver finnas till hands på
            kontoret. Vet du om att du inte kommer vara på kontoret och har haft
            en parkeringsplats så glöm inte att lämna den innan du går hem för
            dagen
        </p>
      </div>
    </div>
  </div>
)

export default InfoPopup
