import sys
import json
import io

# Forzar la salida estándar a UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


# Función para generar ecoConsejos basados en el porcentaje de la huella de carbono
def generar_ecoConsejo_por_categoria(emision_total, porcentaje, categoria):
    consejos_categoria = {
        "agua": {
            "50": [
                "Instala sistemas de ahorro de agua en tu hogar, como inodoros y grifos de bajo flujo.",
                "Reutiliza agua siempre que sea posible, por ejemplo, para riego.",
                "Repara fugas para evitar el desperdicio de agua."
            ],
            "30": [
                "Reduce el tiempo en la ducha para disminuir el consumo de agua.",
                "Usa lavadoras y lavavajillas solo con carga completa."
            ],
            "10": [
                "Aprovecha el agua de lluvia para usos domésticos como riego o limpieza.",
                "Considera sistemas de filtrado y reutilización de aguas grises."
            ],
            "0": [
                "¡Buen trabajo! Sigue optimizando el uso del agua para mantener tu impacto bajo."
            ]
        },
        "vehiculo": {
            "50": [
                "Considera cambiar a un vehículo eléctrico o híbrido para reducir las emisiones.",
                "Usa más el transporte público o las bicicletas, especialmente en trayectos cortos.",
                "Si es posible, reduce el número de viajes en coche, compartiendo vehículos o caminando."
            ],
            "30": [
                "Intenta utilizar más transporte público o compartir viajes.",
                "Considera cambiar a vehículos de bajo consumo de combustible.",
                "Utiliza aplicaciones para optimizar el uso del transporte y reducir el kilometraje."
            ],
            "10": [
                "Conduce de manera eficiente para reducir las emisiones.",
                "Mantén tu vehículo en buen estado para maximizar la eficiencia del combustible.",
                "Cambia los filtros de aire regularmente."
            ],
            "0": [
                "¡Buen trabajo! Esta área tiene un impacto bajo. Sigue buscando maneras de optimizar tu huella de carbono."
            ]
        },
        "transporte_publico": {
            "50": [
                "Usa más el transporte público, como el autobús o el tren, para reducir las emisiones.",
                "Considera cambiar tus viajes en coche por el uso de transporte público."
            ],
            "30": [
                "Intenta evitar el uso del coche en trayectos largos y utilizar más el transporte público.",
                "Comparte tu trayecto con otros para reducir las emisiones."
            ],
            "10": [
                "Considera mejorar la frecuencia del uso de transporte público y optimizar tus rutas.",
                "Evita los horarios punta en el transporte público para reducir el impacto."
            ],
            "0": [
                "¡Buen trabajo! Sigue fomentando el uso del transporte público y las alternativas sostenibles."
            ]
        },
        "aviacion": {
            "50": [
                "Evita tomar vuelos innecesarios, especialmente de corta distancia.",
                "Considera opciones de tren para distancias más cortas."
            ],
            "30": [
                "Si puedes, opta por vuelos directos para reducir las emisiones.",
                "Evita vuelos de corta distancia siempre que sea posible."
            ],
            "10": [
                "Reemplaza algunos vuelos por medios de transporte terrestre como tren o bus."
            ],
            "0": [
                "¡Buen trabajo! Continúa evaluando la necesidad de tus viajes aéreos."
            ]
        },
        "electricidad": {
            "50": [
                "Instala paneles solares o cambia a energía renovable para reducir el consumo de electricidad.",
                "Usa electrodomésticos de bajo consumo para minimizar tu huella de carbono."
            ],
            "30": [
                "Considera reducir el uso de aparatos que consumen mucha energía como calefactores y aires acondicionados.",
                "Asegúrate de que tu hogar esté bien aislado para optimizar el uso de la electricidad."
            ],
            "10": [
                "Apaga los electrodomésticos cuando no los estés usando y utiliza bombillas LED.",
                "Busca fuentes de energía renovable para tu hogar, como paneles solares."
            ],
            "0": [
                "¡Buen trabajo! Esta área tiene un impacto bajo. Continúa utilizando electricidad de fuentes renovables."
            ]
        }
    }
    
    ecoDesafioss_categoria = {
        "agua": {
            "50": "Reduce tu consumo de agua en un 20% durante el próximo mes.",
            "30": "Rastrea tu consumo semanal e identifica áreas de mejora.",
            "10": "Participa en una actividad comunitaria relacionada con la conservación del agua.",
            "0": "Comparte tus prácticas sostenibles con amigos y familiares."
        },
        "vehiculo": {
            "50": "Deja tu vehículo en casa por un día y prueba alternativas sostenibles.",
            "30": "Planea usar transporte público al menos una vez por semana.",
            "10": "Organiza un grupo de carpooling en tu comunidad o trabajo.",
            "0": "Realiza un taller o charla sobre transporte sostenible."
        },
        "transporte_publico": {
            "50": "Comprométete a usar transporte público durante una semana.",
            "30": "Explora rutas alternativas para mejorar tus tiempos de transporte.",
            "10": "Comparte tu experiencia usando transporte público con alguien nuevo.",
            "0": "Promueve los beneficios del transporte público en tu comunidad."
        },
        "aviacion": {
            "50": "Evalúa la posibilidad de evitar vuelos cortos y usar tren o bus.",
            "30": "Calcula la huella de tus vuelos y compensa tu impacto.",
            "10": "Planea tus próximos viajes considerando opciones más sostenibles.",
            "0": "Difunde prácticas de turismo sostenible en redes sociales."
        },
        "electricidad": {
            "50": "Cambia a energía renovable en al menos un área de tu hogar.",
            "30": "Revisa el consumo energético de tu casa y reduce desperdicios.",
            "10": "Sustituye electrodomésticos antiguos por modelos eficientes.",
            "0": "Ayuda a alguien más a optimizar su consumo energético."
        }
    }

    if porcentaje >= 50:
        nivel = "50"
    elif porcentaje >= 30:
        nivel = "30"
    elif porcentaje >= 10:
        nivel = "10"
    else:
        nivel = "0"

    consejo = consejos_categoria[categoria][nivel]
    desafio = ecoDesafioss_categoria[categoria][nivel]

    return {
        "consejo": f"Tu impacto en la categoría {categoria} es alto. ¡Aquí hay sugerencias!",
        "acciones_sugeridas": consejo,
        "ecoDesafios": desafio
    }
  


def calcular_huella(data):
    resultado = {}

    try:
        # Cálculos de huella de carbono
        emisiones_totales = {}
        total_huella = 0

        # Cálculo de huella de carbono por vehículo
        if data["tipo_vehiculo"] == "1":  # Si tiene vehículo
            if data["tipo_vehiculo_especifico"] == "3":  # Carro
                km_diarios = float(data["km_diario"])
                emision_vehiculo = km_diarios * 0.245  # Cálculo de huella en CO2
                emisiones_totales["vehiculo"] = emision_vehiculo
                total_huella += emision_vehiculo
                resultado["vehiculo"] = {
                    "descripcion": f"Kilómetros diarios: {km_diarios} km",
                    "emision_por_km": "0.245 kg CO₂/km",
                    "emision_total": emision_vehiculo
                }
            elif data["tipo_vehiculo_especifico"] == "2":  # Moto
                km_diarios = float(data["km_diario"])
                emision_moto = km_diarios * 0.125  # Cálculo para moto
                emisiones_totales["vehiculo"] = emision_moto
                total_huella += emision_moto
                resultado["vehiculo"] = {
                    "descripcion": f"Kilómetros diarios: {km_diarios} km",
                    "emision_por_km": "0.125 kg CO₂/km",
                    "emision_total": emision_moto
                }
                
                

        # Cálculo de huella de carbono por transporte público
        if data["transporte_publico"] == "1":  # Si usa transporte público
            km_transporte = float(data["km_transporte"])
            if data["medio_transporte"] == "1":  # Bus
                emision_bus = km_transporte * 0.05
                emisiones_totales["transporte_publico"] = emision_bus
                total_huella += emision_bus
                resultado["transporte_publico"] = {
                    "descripcion": f"Kilómetros recorridos en bus: {km_transporte} km",
                    "emision_por_km": "0.05 kg CO₂/km",
                    "emision_total": emision_bus
                }
            elif data["medio_transporte"] == "2":  # Metro
                emision_metro = km_transporte * 0.02
                emisiones_totales["transporte_publico"] = emision_metro
                total_huella += emision_metro
                resultado["transporte_publico"] = {
                    "descripcion": f"Kilómetros recorridos en metro: {km_transporte} km",
                    "emision_por_km": "0.02 kg CO₂/km",
                    "emision_total": emision_metro
                }

        # Cálculo de huella de carbono por vuelos
        if data["viajes_avion"] == "1":  # Si ha viajado en avión
            origen = "Bogotá"  # Suponemos que el origen es Bogotá, ajusta según sea necesario
            destino = data["destino_avion"]
            distancia = 3920.637173056182  # Estimación de la distancia entre Bogotá y Nueva York (en km)
            emision_aviacion = distancia * 0.25  # Estimación de emisión por distancia
            emisiones_totales["aviacion"] = emision_aviacion
            total_huella += emision_aviacion
            resultado["aviacion"] = {
                "descripcion": f"Vuelo de {origen} a {destino}",
                "distancia_km": distancia,
                "emision_por_km": "0.25 kg CO₂/km",
                "emision_total": emision_aviacion
            }



        # Cálculos adicionales para electricidad
        consumo_electricidad = float(data["consumo_electricidad"])
        emision_electricidad = consumo_electricidad * 0.92  # Cálculo de huella de electricidad
        emisiones_totales["electricidad"] = emision_electricidad
        total_huella += emision_electricidad
        resultado["electricidad"] = {
            "descripcion": f"Consumo de electricidad: {consumo_electricidad} kWh",
            "emision_por_kWh": "0.92 kg CO₂/kWh",
            "emision_total": emision_electricidad
        }
        
        # Cálculo de huella de carbono por consumo de agua
        consumo_agua = float(data.get("consumo_agua", 0))  # Obtener el consumo de agua
        if consumo_agua > 0:
         emision_agua = consumo_agua * 0.61  # 0.34 (agua potable) + 0.27 (aguas residuales)
         emisiones_totales["agua"] = emision_agua
         total_huella += emision_agua
         resultado["agua"] = {
             "descripcion": f"Consumo de agua: {consumo_agua} m³",
             "emision_por_m3": "0.61 kg CO₂/m³",
             "emision_total": emision_agua
        }
         
         
         for categoria, emision in emisiones_totales.items():
            porcentaje = (emision / total_huella) * 100
            eco_data = generar_ecoConsejo_por_categoria(emision, porcentaje, categoria)
            resultado[categoria]["ecoConsejo"] = eco_data["consejo"]
            resultado[categoria]["acciones_sugeridas"] = eco_data["acciones_sugeridas"]
            resultado[categoria]["ecoDesafios"] = eco_data["ecoDesafios"]

        resultado["total"] = {
            "descripcion": "Suma total de todas las emisiones de carbono",
            "emision_total": total_huella
        }

        print(json.dumps({"resultado_huella": resultado}, ensure_ascii=False, indent=4))

    except Exception as e:
        print(json.dumps({"error": str(e)}))




if __name__ == "__main__":
    input_data = sys.stdin.read()  # Leer datos de la entrada estándar
    data = json.loads(input_data)  # Convertir los datos a formato JSON
    calcular_huella(data)  # Calcular la huella de carbono
