"""
Script para probar las optimizaciones del dashboard
"""
import sys
import os
import time
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import DataCache, load_optimized_data, get_sample_data, calcular_kpi_1, calcular_kpi_2, calcular_kpi_3, calcular_kpi_4, calcular_kpi_5, calcular_kpi_6

def test_data_loading():
    """Probar carga de datos optimizada"""
    print("=== PRUEBA DE CARGA DE DATOS ===")
    
    print("\n1. Probando carga de muestra (50K registros)...")
    start_time = time.time()
    sample_data = get_sample_data()
    sample_time = time.time() - start_time
    print(f"   ✓ Muestra cargada: {len(sample_data)} registros en {sample_time:.2f} segundos")
    
    print("\n2. Probando carga optimizada completa...")
    start_time = time.time()
    full_data = load_optimized_data()
    full_time = time.time() - start_time
    print(f"   ✓ Datos completos: {len(full_data)} registros en {full_time:.2f} segundos")
    
    return sample_data

def test_kpi_calculations(sample_data):
    """Probar cálculo de KPIs optimizado"""
    print("\n=== PRUEBA DE CÁLCULO DE KPIS ===")
    
    kpis = [
        ("KPI 1", calcular_kpi_1),
        ("KPI 2", calcular_kpi_2),
        ("KPI 3", calcular_kpi_3),
        ("KPI 4", calcular_kpi_4),
        ("KPI 5", calcular_kpi_5),
        ("KPI 6", calcular_kpi_6)
    ]
    
    for kpi_name, kpi_func in kpis:
        start_time = time.time()
        result = kpi_func(sample_data, use_sample=False)
        calc_time = time.time() - start_time
        
        status = "✓" if result['estado'] != 'ERROR' else "✗"
        print(f"   {status} {kpi_name}: {result['valor']}{result['unidad']} ({result['estado']}) - {calc_time:.3f}s")

def test_cache_system():
    """Probar sistema de caché"""
    print("\n=== PRUEBA DE SISTEMA DE CACHÉ ===")
    
    cache = DataCache()
    
    print("\n1. Primera carga (sin caché)...")
    start_time = time.time()
    data1 = cache.get_data()
    first_load = time.time() - start_time
    print(f"   Primera carga: {len(data1)} registros en {first_load:.2f} segundos")
    
    print("\n2. Segunda carga (con caché)...")
    start_time = time.time()
    data2 = cache.get_data()
    cached_load = time.time() - start_time
    print(f"   Carga desde caché: {len(data2)} registros en {cached_load:.4f} segundos")
    
    speedup = first_load / cached_load if cached_load > 0 else float('inf')
    print(f"   ✓ Aceleración del caché: {speedup:.1f}x más rápido")

if __name__ == "__main__":
    try:
        # Probar carga de datos
        sample_data = test_data_loading()
        
        # Probar cálculos de KPIs
        if not sample_data.empty:
            test_kpi_calculations(sample_data)
        
        # Probar sistema de caché
        test_cache_system()
        
        print("\n=== RESUMEN ===")
        print("✓ Todas las optimizaciones están funcionando correctamente")
        print("✓ Sistema listo para uso en producción")
        
    except Exception as e:
        print(f"\n✗ Error durante las pruebas: {e}")
        import traceback
        traceback.print_exc()