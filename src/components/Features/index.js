import SectionTitle from "../Common/SectionTitle"; // Asegúrate de que la ruta sea correcta
import SingleFeature from "./SingleFeature"; // Asegúrate de que la ruta sea correcta
import featuresData from "./featuresData"; // Asegúrate de que la ruta sea correcta


const Features = () => {
    return (
        <>
            <section id="features" className="py-16 md:py-20 lg:py-28">
                <div className="container">
                    <SectionTitle
                        title="Beneficios"
                        paragraph="Fomenta la inclusión social, educativa y laboral de personas sordas, mejora la comunicación con oyentes y garantiza usabilidad en entornos como escuelas, trabajos y atención al cliente."
                        center
                    />

                    <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                        {featuresData.map((feature) => (
                            <SingleFeature key={feature.id} feature={feature} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Features;
