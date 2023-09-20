#include <linux/module.h>
// para usar KERN_INFO
#include <linux/kernel.h>
//Header para los macros module_init y module_exit
#include <linux/init.h>
//Header necesario porque se usara proc_fs
#include <linux/proc_fs.h>
/* for copy_from_user */
#include <asm/uaccess.h>	
/* Header para usar la lib seq_file y manejar el archivo en /proc*/
#include <linux/seq_file.h>
#include <linux/sysinfo.h>
#include <linux/mm.h>


MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Ejemplo creacion de modulo en Linux, Laboratorio Sistemas Operativos 1 - Tarea 4");
MODULE_AUTHOR("Allen Roman");
MODULE_VERSION("1.0");

/*
{
	"Total_Ram": 8000,
	"Ram_en_Uso": 6000,
	"Ram_libre": 2000,
	"Porcentaje_en_uso": 75
}
//Modulo que muestra la informacion de la memoria RAM
*/

static int escribir_archivo(struct seq_file *archivo, void *v)
{
    struct sysinfo info;
    long total_memoria, memoria_libre, memoria_en_uso, porcentaje_en_uso;
    si_meminfo(&info);

    total_memoria = (info.totalram * info.mem_unit)/(1024*1024);
    memoria_libre = (info.freeram * info.mem_unit)/(1024*1024);
    memoria_en_uso = total_memoria - memoria_libre;
    porcentaje_en_uso = (memoria_en_uso * 100) / total_memoria;
    seq_printf(archivo, "{\n");
    seq_printf(archivo, "\"Total_Ram\": %lu,\n", total_memoria);
    seq_printf(archivo, "\"Ram_en_Uso\": %lu,\n", memoria_en_uso);
    seq_printf(archivo, "\"Ram_libre\": %lu,\n", memoria_libre);
    seq_printf(archivo, "\"Porcentaje_en_uso\": %lu\n", porcentaje_en_uso);
    seq_printf(archivo, "}\n");
    return 0;
}

//Funcion que se ejecuta cuando se le hace un cat al modulo.
static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

// Si el su Kernel es 5.6 o mayor
static struct proc_ops operaciones =
{
    .proc_open = al_abrir,
    .proc_read = seq_read
};

static int _insert(void)
{
    proc_create("ram_202004745", 0, NULL, &operaciones);
    printk(KERN_INFO "Proyecto 1 - 202004745\n");
    return 0;
}

static void _remove(void)
{
    remove_proc_entry("ram_202004745", NULL);
    printk(KERN_INFO "Proyecto 1 - Allen Roman\n");
}

module_init(_insert);
module_exit(_remove);